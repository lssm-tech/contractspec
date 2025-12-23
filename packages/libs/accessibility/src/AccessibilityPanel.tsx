'use client';

import React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@lssm/lib.ui-kit-web/ui/dialog';
import { Button } from '@lssm/lib.design-system';
import { Switch } from '@lssm/lib.ui-kit-web/ui/switch';
import { Label } from '@lssm/lib.ui-kit-web/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@lssm/lib.ui-kit-web/ui/select';
import {
  type ReduceMotion,
  type TextSize,
  useA11YPreferences,
} from './preferences';
import { cn } from '@lssm/lib.ui-kit-web/ui/utils';

export function AccessibilityPanel({ className }: { className?: string }) {
  const { preferences, setPreferences } = useA11YPreferences();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" aria-haspopup="dialog">
          Accessibility
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/40" />
        <DialogContent
          className={cn(
            // 'fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background p-6 shadow-lg outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
            'bg-background focus-visible:ring-ring max-w-md p-6 shadow-lg outline-hidden focus-visible:ring-2',
            className
          )}
          aria-describedby="a11y-panel-desc"
        >
          <DialogTitle className="text-lg font-semibold">
            Accessibility settings
          </DialogTitle>
          <p id="a11y-panel-desc" className="text-muted-foreground text-sm">
            Adjust text size, spacing, focus and motion to suit your needs.
          </p>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label>Text size</Label>
              <Select
                value={preferences.textSize}
                onValueChange={(v) =>
                  setPreferences({ textSize: v as TextSize })
                }
              >
                <SelectTrigger aria-label="Text size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="s">Small</SelectItem>
                  <SelectItem value="m">Medium</SelectItem>
                  <SelectItem value="l">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="text-spacing">
                Increase text spacing (WCAG 1.4.12)
              </Label>
              <Switch
                id="text-spacing"
                checked={preferences.textSpacing === 'increased'}
                onCheckedChange={(c) =>
                  setPreferences({ textSpacing: c ? 'increased' : 'normal' })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="line-height">Increase line height</Label>
              <Switch
                id="line-height"
                checked={preferences.lineHeight === 'increased'}
                onCheckedChange={(c) =>
                  setPreferences({ lineHeight: c ? 'increased' : 'normal' })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="underline-links">Always underline links</Label>
              <Switch
                id="underline-links"
                checked={preferences.underlineLinks}
                onCheckedChange={(c) => setPreferences({ underlineLinks: c })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="focus-ring">Thick focus ring</Label>
              <Switch
                id="focus-ring"
                checked={preferences.focusRing === 'thick'}
                onCheckedChange={(c) =>
                  setPreferences({ focusRing: c ? 'thick' : 'normal' })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Motion</Label>
              <Select
                value={preferences.reduceMotion}
                onValueChange={(v) =>
                  setPreferences({ reduceMotion: v as ReduceMotion })
                }
              >
                <SelectTrigger aria-label="Motion preferences">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">Follow system</SelectItem>
                  <SelectItem value="reduce">Reduce motion</SelectItem>
                  <SelectItem value="no-preference">Allow motion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="contrast">High contrast</Label>
              <Switch
                id="contrast"
                checked={preferences.highContrast}
                onCheckedChange={(c) => setPreferences({ highContrast: c })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="dyslexia-font">Dyslexia-friendly font</Label>
              <Switch
                id="dyslexia-font"
                checked={preferences.dyslexiaFont}
                onCheckedChange={(c) => setPreferences({ dyslexiaFont: c })}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
