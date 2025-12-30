import * as React from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@contractspec/lib.ui-kit-web/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@contractspec/lib.ui-kit-web/ui/dropdown-menu';
import { Button } from '../atoms/Button';
import type { UserMenuItem } from '../../types/navigation';

export function NavUser({
  name,
  email,
  imageUrl,
  items,
}: {
  name?: string;
  email?: string;
  imageUrl?: string;
  items: UserMenuItem[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Account">
          <Avatar className="h-8 w-8">
            {imageUrl ? (
              <AvatarImage src={imageUrl} alt={name ?? 'user'} />
            ) : (
              <AvatarFallback>{name?.[0] ?? '?'}</AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {(name || email) && (
          <>
            <DropdownMenuLabel>
              <div className="flex flex-col">
                {name && <span className="font-medium">{name}</span>}
                {email && (
                  <span className="text-muted-foreground text-base">
                    {email}
                  </span>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {items.map((it, i) => (
          <DropdownMenuItem key={i} onClick={it.onClick} asChild={!it.href}>
            {it.href ? (
              <a
                href={it.href}
                className={it.danger ? 'text-destructive' : undefined}
              >
                <span className="inline-flex items-center gap-2">
                  {it.icon}
                  {it.label}
                </span>
              </a>
            ) : (
              <span className={it.danger ? 'text-destructive' : undefined}>
                <span className="inline-flex items-center gap-2">
                  {it.icon}
                  {it.label}
                </span>
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
