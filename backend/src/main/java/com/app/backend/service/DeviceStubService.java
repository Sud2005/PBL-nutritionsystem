package com.app.backend.service;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class DeviceStubService {
    private final Random random = new Random();
    private final Map<Long, DeviceState> stateMap = new ConcurrentHashMap<>();

    public DeviceState simulate(Long userId) {
        DeviceState state = stateMap.computeIfAbsent(userId, k -> new DeviceState(70.0, 20.0));
        
        double newWeight = state.weightKg() + (random.nextDouble() * 4 - 2);
        double newFat = state.bodyFatPercent() + (random.nextDouble() * 2 - 1);
        
        newWeight = Math.max(30, Math.min(200, newWeight));
        newFat = Math.max(5, Math.min(50, newFat));
        
        DeviceState newState = new DeviceState(
            Math.round(newWeight * 10.0) / 10.0, 
            Math.round(newFat * 10.0) / 10.0
        );
        stateMap.put(userId, newState);
        return newState;
    }
    
    public record DeviceState(double weightKg, double bodyFatPercent) {}
}
