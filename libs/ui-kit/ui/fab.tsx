import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { cn } from '@contractspec/lib.ui-kit-core/utils';
import { Plus, X } from 'lucide-react-native';

interface FABAction {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  color?: string;
}

interface FABProps {
  actions: FABAction[];
  className?: string;
  mainIcon?: React.ReactNode;
  mainColor?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FAB({
  actions,
  className,
  mainIcon,
  mainColor = 'bg-primary',
}: FABProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const rotation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withSpring(isOpen ? '45deg' : '0deg', {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
    };
  });

  return (
    <View className={cn('absolute right-4 bottom-24 z-50', className)}>
      {/* Backdrop */}
      {isOpen && (
        <Pressable
          style={StyleSheet.absoluteFillObject}
          className="fixed inset-0 -top-full -left-full h-[200%] w-[200%]"
          onPress={() => setIsOpen(false)}
        />
      )}

      {/* Action buttons */}
      {actions.map((action, index) => {
        const translateY = useAnimatedStyle(() => {
          const baseTranslation = isOpen ? -(index + 1) * 65 : 0;
          return {
            transform: [
              {
                translateY: withSpring(baseTranslation, {
                  damping: 15,
                  stiffness: 150,
                  mass: 1 + index * 0.1,
                }),
              },
            ],
            opacity: withTiming(isOpen ? 1 : 0, {
              duration: 200,
            }),
            pointerEvents: isOpen ? 'auto' : 'none',
          };
        });

        const scale = useAnimatedStyle(() => {
          return {
            transform: [
              {
                scale: withSpring(isOpen ? 1 : 0.8, {
                  damping: 15,
                  stiffness: 150,
                }),
              },
            ],
          };
        });

        return (
          <AnimatedPressable
            key={index}
            style={[translateY, scale]}
            className="absolute right-0 bottom-0"
            onPress={() => {
              action.onPress();
              setIsOpen(false);
            }}
          >
            <View
              className={cn(
                'h-12 w-12 items-center justify-center rounded-full shadow-lg',
                action.color || 'bg-secondary'
              )}
            >
              {action.icon}
            </View>
          </AnimatedPressable>
        );
      })}

      {/* Main FAB button */}
      <AnimatedPressable
        onPress={toggleMenu}
        className={cn(
          'h-14 w-14 items-center justify-center rounded-full shadow-xl',
          mainColor
        )}
        style={[
          rotation,
          {
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          },
        ]}
      >
        {isOpen ? (
          <X size={24} color="white" strokeWidth={2.5} />
        ) : (
          mainIcon || <Plus size={24} color="white" strokeWidth={2.5} />
        )}
      </AnimatedPressable>
    </View>
  );
}

// Mini FAB for single actions
export function MiniFAB({
  icon,
  onPress,
  className,
  color = 'bg-primary',
}: {
  icon: React.ReactNode;
  onPress: () => void;
  className?: string;
  color?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'h-12 w-12 items-center justify-center rounded-full shadow-lg',
        color,
        className
      )}
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      {icon}
    </Pressable>
  );
}
