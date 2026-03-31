# Project Demo & Presentation Guide
**Indian Diet Decision System**

Use this guide as your "script" to deploy, showcase, and explain your project for your presentation. It breaks down exactly what features to demonstrate and how they technically map to modern Java Spring Boot architectures.

---

## 🚀 1. How to Deploy & Start the Project

**Before the Demo:**
1. Ensure your **Groq API Key** is pasted into `backend/src/main/resources/application.properties` as:
   `groq.api.key=YOUR_API_KEY_HERE`
2. Ensure you have Java 17+ and Node.js installed.

**Starting the System (Live Demo):**
1. Open PowerShell to the project root directory (`c:\coding\mpj\mpj_mini_project`).
2. Run the automated startup script:
   ```powershell
   .\start.ps1
   ```
   *What to tell the panel:* "I wrote a PowerShell automation script that concurrently compiles the Spring Boot backend, manages the Node.js dependencies, and launches the entire full-stack ecosystem simultaneously under one command."
3. Open a browser to `http://localhost:5173`.

---

## 🎙️ 2. Step-by-Step Demo Flow (What to show)

Follow this order to showcase the platform chronologically to the panel:

### **Step 1: Sign up & Secure Authentication**
- **Action:** Register a new user account on the frontend.
- **Showcase:** Explain that passwords are automatically hashed before hitting the SQLite database. Login issues a secure JSON Web Token (JWT).
- **Relates to Java:** `JwtUtil.java`, `SecurityConfig.java`, Spring Security filter chains, BCrypt hashing.

### **Step 2: The Health Profile Wizard**
- **Action:** Fill out the Health Profile (Age, Height, Weight, Activity Level, Health Conditions like "Diabetes", and Dietary Preference like "Veg").
- **Showcase:** Show how it automatically calculates BMI (and BMI Category like Overweight/Normal), BMR (Basal Metabolic Rate), and TDEE (Total Daily Energy Expenditure). 
- **Relates to Java:** `BMICalculatorService.java` and `BMRCalculatorService.java`. It highlights standard Object-Oriented encapsulate of complex math components into Spring `@Service` beans. 

### **Step 3: The Rule-Based Indian Diet Engine**
- **Action:** Go to the "Indian Diet Engine" Dashboard.
- **Showcase:** Show the visual dashboard. Highlight that the system automatically split 80+ Indian foods into `Recommended`, `Limited`, and `Avoid` baskets based on the user's health profile (e.g. if you selected Diabetes, white rice is limited, karela/oats are recommended). Show the breakdown of macronutrients in the ring chart. Show the randomized daily meal plan (Breakfast/Lunch/Dinner) generated mathematically to hit the exact TDEE target calorie range.
- **Relates to Java:** `DietRuleEngine.java`. This is the core "Brain" of the project. It uses Java 17 **Stream APIs** and **Lambdas** to map, filter, and iterate across thousands of combinational dietary rules dynamically fetched via JPA/Hibernate. 

### **Step 4: AI Nutritionist (Groq Llama-3)**
- **Action:** Click "Ask Priya AI" and ask a question like "Given my diabetes and current meal plan, what should I eat if I'm craving something sweet?"
- **Showcase:** The AI will answer natively knowing exactly what the user's BMI and health conditions are *without* the user having to type it!
- **Relates to Java:** `ChatService.java` uses Spring's `RestTemplate` to make RESTful POST requests to external APIs (Groq). It demonstrates how Java backends can dynamically inject system prompts (using string builders and JSON mapping via Jackson/ObjectMapper) into Large Language Models (LLMs).

### **Step 5: Admin & Role-Based Access**
- **Action:** Explain that the system utilizes Role-Based Access Control (RBAC). 
- **Showcase:** Mention that if a user has the `ROLE_ADMIN` tag in the database, they get a custom Admin Control Panel to dynamically add/remove Food rules without modifying Java source code. Mention that `ROLE_NUTRITIONIST` allows dietitians to monitor their assigned patients.
- **Relates to Java:** Handled natively by Spring Security’s `@PreAuthorize("hasRole('ROLE_ADMIN')")` annotations preventing arbitrary API requests.

---

## 🧠 3. Key Talking Points (How it relates to pure Java)

If the professors/panel ask specific technical questions about your Java implementation, use these points:

1. **Model-View-Controller (MVC) Architecture:**
   - The backend strictly follows MVC Separation of Concerns.
   - `@Entity` classes (Models) representing SQLite Tables.
   - `Repositories` (Data Access Layer via Spring Data JPA) abstracting SQL queries into Java methods.
   - `@Service` classes (Business Logic Layer) doing the heavy mathematical lifting (BMI math, Rule inferences).
   - `@RestController` classes (Controllers) exclusively handling HTTP traffic and JSON serialization.
2. **Idempotent Data Seeding:**
   - Instead of inserting food manually during the demo, the backend utilizes an `ApplicationRunner` (`DataSeeder.java`). Explain that the moment the Spring Context boots, Java validates the SQLite tables and gracefully auto-injects an 80+ item Indian Food catalog if the database is empty.
3. **Robust Unit & Integration Testing:**
   - Show them the `src/test/java/com/app/backend` folder. Explain that you utilized JUnit 5 and `MockMvc` to automate tests for the Authentication flows, the BMI math validation, and the Diet Engine rules, ensuring Enterprise-level stability.
4. **Relational Database Mapping (ORM):**
   - Java uses Hibernate to map relationships, such as the `HealthProfile` belonging to a `User` utilizing `@OneToOne(cascade = CascadeType.ALL)` associations.
