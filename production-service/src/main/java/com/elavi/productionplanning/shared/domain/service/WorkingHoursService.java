package com.elavi.productionplanning.shared.domain.service;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Service;

@Service
public class WorkingHoursService {

    private static final ZoneId ZONE = ZoneId.of("Europe/Brussels");
    private static final int WORK_START_HOUR = 8;
    private static final int WORK_END_HOUR = 17;
    private static final int WORK_HOURS_PER_DAY = WORK_END_HOUR - WORK_START_HOUR;

    private final Set<String> holidays = new HashSet<>(); // Format: "YYYY-MM-DD"

    public WorkingHoursService() {
        // Mock some holidays
        holidays.add("2026-12-25");
        holidays.add("2027-01-01");
    }

    public Instant addWorkingMinutes(Instant start, int minutesToAdd) {
        ZonedDateTime current = start.atZone(ZONE);
        int remainingMinutes = minutesToAdd;

        // Ensure we start within working hours
        current = adjustToNextWorkingTime(current);

        while (remainingMinutes > 0) {
            int currentHour = current.getHour();
            int currentMinute = current.getMinute();
            
            // Minutes until the end of the current working day
            int minutesLeftToday = (WORK_END_HOUR - currentHour) * 60 - currentMinute;

            if (remainingMinutes <= minutesLeftToday) {
                // Can finish today
                current = current.plusMinutes(remainingMinutes);
                remainingMinutes = 0;
            } else {
                // Span to next day
                remainingMinutes -= minutesLeftToday;
                // Move to start of next day
                current = current.plusDays(1).withHour(WORK_START_HOUR).withMinute(0).withSecond(0).withNano(0);
                current = adjustToNextWorkingTime(current);
            }
        }

        return current.toInstant();
    }

    public Instant addWorkingDays(Instant start, int daysToAdd) {
        ZonedDateTime current = start.atZone(ZONE);
        int remainingDays = daysToAdd;

        // Ensure we start on a working day
        current = adjustToNextWorkingTime(current);

        while (remainingDays > 0) {
            current = current.plusDays(1);
            
            // Check if the new day is a working day
            boolean isWorkingDay = true;
            DayOfWeek dayOfWeek = current.getDayOfWeek();
            if (dayOfWeek == DayOfWeek.SUNDAY) {
                isWorkingDay = false;
            }
            if (holidays.contains(current.toLocalDate().toString())) {
                isWorkingDay = false;
            }

            if (isWorkingDay) {
                remainingDays--;
            }
        }

        return current.toInstant();
    }

    private ZonedDateTime adjustToNextWorkingTime(ZonedDateTime time) {
        ZonedDateTime adjusted = time;
        
        while (true) {
            boolean changed = false;

            // Check if before working hours
            if (adjusted.getHour() < WORK_START_HOUR) {
                adjusted = adjusted.withHour(WORK_START_HOUR).withMinute(0).withSecond(0).withNano(0);
                changed = true;
            }
            
            // Check if after working hours
            if (adjusted.getHour() >= WORK_END_HOUR) {
                adjusted = adjusted.plusDays(1).withHour(WORK_START_HOUR).withMinute(0).withSecond(0).withNano(0);
                changed = true;
            }
            
            // Check weekends
            DayOfWeek dayOfWeek = adjusted.getDayOfWeek();
            if (dayOfWeek == DayOfWeek.SUNDAY || dayOfWeek == DayOfWeek.SATURDAY) {
                // According to example, Mon-Sat 08:00-17:00, so Sunday is a weekend. The example says Mon-Sat. Let's make only Sunday a weekend.
                if (dayOfWeek == DayOfWeek.SUNDAY) {
                    adjusted = adjusted.plusDays(1).withHour(WORK_START_HOUR).withMinute(0).withSecond(0).withNano(0);
                    changed = true;
                }
            }
            
            // Check holidays
            String dateString = adjusted.toLocalDate().toString();
            if (holidays.contains(dateString)) {
                adjusted = adjusted.plusDays(1).withHour(WORK_START_HOUR).withMinute(0).withSecond(0).withNano(0);
                changed = true;
            }
            
            if (!changed) {
                break; // Valid working time found
            }
        }
        return adjusted;
    }
}



