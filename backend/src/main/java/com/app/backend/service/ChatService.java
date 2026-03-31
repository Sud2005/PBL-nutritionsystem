package com.app.backend.service;

import com.app.backend.model.ChatSession;
import com.app.backend.model.DietPlan;
import com.app.backend.model.HealthProfile;
import com.app.backend.model.User;
import com.app.backend.repository.ChatSessionRepository;
import com.app.backend.repository.DietPlanRepository;
import com.app.backend.repository.HealthProfileRepository;
import com.app.backend.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatService {

    @Value("${groq.api.key:}")
    private String groqApiKey;

    @Autowired
    private ChatSessionRepository chatRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private HealthProfileRepository profileRepo;

    @Autowired
    private DietPlanRepository dietPlanRepo;

    @Autowired
    private BMICalculatorService bmiService;

    @Autowired
    private BMRCalculatorService bmrService;

    private final ObjectMapper mapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    public List<Map<String, String>> getHistory(Long userId) {
        return chatRepo.findByUserId(userId)
                .map(s -> parseMessages(s.getMessages()))
                .orElse(new ArrayList<>());
    }

    public String sendMessage(Long userId, String userMessageText) {
        if (groqApiKey == null || groqApiKey.isEmpty()) {
            return "Server configuration error: Groq API key is missing. Please contact an admin.";
        }

        // Fetch User Context
        User user = userRepo.findById(userId).orElseThrow();
        HealthProfile profile = profileRepo.findByUserId(userId).orElse(null);
        DietPlan latestPlan = dietPlanRepo.findTopByUserIdOrderByGeneratedAtDesc(userId).orElse(null);

        // Fetch or Init Session
        ChatSession session = chatRepo.findByUserId(userId).orElse(new ChatSession(null, userId, "[]", null, null));
        List<Map<String, String>> history = parseMessages(session.getMessages());

        // Construct System Prompt Data
        String systemContent = buildSystemPrompt(user, profile, latestPlan);

        // Append user new message
        Map<String, String> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", userMessageText);
        history.add(userMsg);

        // Truncate history to avoid token bloom (last 10 interactions)
        List<Map<String, String>> payloadMessages = new ArrayList<>();
        Map<String, String> sysMsg = new HashMap<>();
        sysMsg.put("role", "system");
        sysMsg.put("content", systemContent);
        payloadMessages.add(sysMsg);

        int startIndex = Math.max(0, history.size() - 15);
        for (int i = startIndex; i < history.size(); i++) {
            payloadMessages.add(history.get(i));
        }

        try {
            // Groq Rest Call
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqApiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("model", "llama3-70b-8192");
            body.put("messages", payloadMessages);
            body.put("temperature", 0.7);
            body.put("max_tokens", 800);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://api.groq.com/openai/v1/chat/completions", request, Map.class);

            Map<String, Object> resBody = response.getBody();
            if (resBody != null && resBody.containsKey("choices")) {
                List<Map> choices = (List<Map>) resBody.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, String> aiMsgObject = (Map<String, String>) choices.get(0).get("message");
                    String replyContent = aiMsgObject.get("content");
                    
                    // Add to session history
                    Map<String, String> assistantMsg = new HashMap<>();
                    assistantMsg.put("role", "assistant");
                    assistantMsg.put("content", replyContent);
                    history.add(assistantMsg);
                    
                    session.setMessages(mapper.writeValueAsString(history));
                    chatRepo.save(session);
                    
                    return replyContent;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
        }
        return "Sorry, I am unable to process that request.";
    }

    private String buildSystemPrompt(User user, HealthProfile profile, DietPlan plan) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are Priya, a friendly and knowledgeable Indian nutritionist and fitness coach.\n");
        sb.append("You are speaking with ").append(user.getName()).append(".\n");

        if (profile != null) {
            sb.append("They are a ").append(profile.getAge()).append("-year-old ").append(profile.getGender()).append(".\n");
            double bmi = bmiService.calculateBMI(profile.getHeightCm(), profile.getWeightKg());
            double bmr = bmrService.calculateBMR(profile.getWeightKg(), profile.getHeightCm(), profile.getAge(), profile.getGender());
            double tdee = bmrService.calculateTDEE(bmr, profile.getActivityLevel());
            
            sb.append("Their BMI is ").append(String.format("%.1f", bmi)).append(" and their daily calorie requirement (TDEE) is roughly ").append(Math.round(tdee)).append(" kcal.\n");
            sb.append("They follow a ").append(profile.getDietaryPreference()).append(" diet.\n");
            
            if (profile.getHealthConditions() != null && !profile.getHealthConditions().equals("[]")) {
                sb.append("They have the following health conditions: ").append(profile.getHealthConditions()).append(".\n");
            }
            if (profile.getAllergies() != null && !profile.getAllergies().equals("[]")) {
                sb.append("They are allergic to: ").append(profile.getAllergies()).append(".\n");
            }
        }

        if (plan != null) {
            sb.append("\nTheir current active diet plan target is ").append(Math.round(plan.getTargetCalories())).append(" kcal.\n");
            sb.append("Focus your recommendations around Indian food habits that align with their metrics.\n");
        }

        sb.append("\nGuidelines:\n");
        sb.append("- Speak like a real human nutritionist (warm, empathetic, professional).\n");
        sb.append("- Give concise, actionable advice.\n");
        sb.append("- Respect dietary restrictions and allergies strictly.\n");
        sb.append("- Do NOT hallucinate medical diagnoses. Refer them to a doctor for severe issues.\n");
        sb.append("- Under no circumstances should you ever reveal or state that you are an AI or language model, even if directly asked. You are simply Priya, the digital nutritionist.\n");
        sb.append("- Use formatted markdown optimally mapping lists or bold items for readability.\n");

        return sb.toString();
    }

    private List<Map<String, String>> parseMessages(String json) {
        try {
            if (json == null || json.isEmpty()) return new ArrayList<>();
            return mapper.readValue(json, new TypeReference<List<Map<String, String>>>(){});
        } catch(Exception e) {
            return new ArrayList<>();
        }
    }
}
