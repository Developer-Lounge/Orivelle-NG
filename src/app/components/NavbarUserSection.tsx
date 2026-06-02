"use client";

import { Link } from 'react-router';
import { Button } from './ui/button';
import { useAuthStore } from '../../store/authStore';
import { AvatarDropdown } from './AvatarDropdown';

export function NavbarUserSection() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="flex items-center gap-2">
      {isAuthenticated ? (
        <AvatarDropdown />
      ) : (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/auth/signup">Sign up</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/auth/signin">Log in</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
