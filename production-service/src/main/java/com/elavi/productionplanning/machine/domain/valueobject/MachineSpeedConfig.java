package com.elavi.productionplanning.machine.domain.valueobject;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.elavi.productionplanning.shared.domain.valueobject.SpeedStrategyType;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MachineSpeedConfig {
    private SpeedStrategyType strategyType;
    private double parameterValue; // range or speed
    private double efficiency; // e.g. 0.85 for 85%
    private int setupTimeMinutes; // Setup time per job/form version

    // Calculate time in minutes based on the strategy
    public int calculateTimeNeeded(double width, double height, int pieces) {
        double time = 0;
        double eff = (efficiency > 0) ? efficiency : 1.0;
        double param = (parameterValue > 0) ? parameterValue : 1.0;

        switch (strategyType) {
            case SQUARE_METER_RANGE_SPEED:
                time = (width * height * pieces) / (param * eff);
                break;
            case PIECES_RANGE_SPEED:
                time = pieces / (param * eff);
                break;
            case METER_SPEED:
                time = (height * pieces) / (param * eff);
                break;
            case METER_CIRCUMFERENCE_SPEED:
                time = (2 * width + 2 * height) * pieces / (param * eff);
                break;
            case CONSTANT_TIME:
                time = param;
                break;
        }

        int totalMinutes = (int) Math.ceil(time);
        return Math.max(totalMinutes, 1); // Minimum 1 minute
    }
}



