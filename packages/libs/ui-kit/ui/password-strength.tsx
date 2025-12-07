import React from 'react';
import { View } from 'react-native';
import { HStack, VStack } from './stack';
import { Text } from './text';
import * as z from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
  .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
  .regex(/(?=.*\d)/, 'Password must contain at least one number');

// Password strength indicator
export function getPasswordStrength(password: string): {
  score: number;
  feedback: string[];
  isValid: boolean;
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('At least 8 characters');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('One lowercase letter');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('One uppercase letter');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('One number');
  }

  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    score += 1;
  }

  if (password.length >= 12) {
    score += 1;
  }

  const isValid = passwordSchema.safeParse(password).success;

  return {
    score: Math.min(score, 5),
    feedback,
    isValid,
  };
}

interface PasswordStrengthProps {
  password: string;
  showFeedback?: boolean;
}

export function PasswordStrength({
  password,
  showFeedback = true,
}: PasswordStrengthProps) {
  const { score, feedback, isValid } = getPasswordStrength(password);

  if (!password) return null;

  const getStrengthColor = (score: number) => {
    if (score <= 1) return '#ef4444'; // red-500
    if (score <= 2) return '#f97316'; // orange-500
    if (score <= 3) return '#eab308'; // yellow-500
    if (score <= 4) return '#22c55e'; // green-500
    return '#16a34a'; // green-600
  };

  const getStrengthText = (score: number) => {
    if (score <= 1) return 'Very Weak';
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Fair';
    if (score <= 4) return 'Good';
    return 'Strong';
  };

  return (
    <VStack className="gap-y-2">
      {/* Strength Bar */}
      <VStack className="gap-y-1">
        <HStack className="items-center justify-between">
          <Text className="text-muted-foreground text-xs">
            Password Strength
          </Text>
          <Text
            className="text-xs font-medium"
            style={{ color: getStrengthColor(score) }}
          >
            {getStrengthText(score)}
          </Text>
        </HStack>

        <View className="h-2 overflow-hidden rounded-full bg-gray-200">
          <View
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${(score / 5) * 100}%`,
              backgroundColor: getStrengthColor(score),
            }}
          />
        </View>
      </VStack>

      {/* Feedback */}
      {showFeedback && feedback.length > 0 && (
        <VStack className="gap-y-1">
          <Text className="text-muted-foreground text-xs">Required:</Text>
          {feedback.map((item, index) => (
            <HStack key={index} className="items-center gap-x-2">
              <View className="bg-muted-foreground h-1 w-1 rounded-full" />
              <Text className="text-muted-foreground text-xs">{item}</Text>
            </HStack>
          ))}
        </VStack>
      )}

      {/* Valid indicator */}
      {isValid && (
        <HStack className="items-center gap-x-2">
          <View className="h-2 w-2 rounded-full bg-green-500" />
          <Text className="text-xs text-green-600">Meets requirements</Text>
        </HStack>
      )}
    </VStack>
  );
}
