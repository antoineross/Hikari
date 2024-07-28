'use client';
import { useTheme } from 'next-themes';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Icons } from '@/components/icons';
import { AtSign, Bell, EyeOff, X } from 'lucide-react';

export default function SettingsPage() {
  const [isEverythingToggled, setIsEverythingToggled] = useState(false);
  const [isAvailableToggled, setIsAvailableToggled] = useState(true);
  const [isNotificationToggled, setIsNotificationToggled] = useState(true);
  const { setTheme } = useTheme();

  return (
    <div className="w-full mx-auto">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Customize your account and preferences.
          </p>
        </div>
        <div className="grid gap-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Choose what you want to be notified about.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div
                className={`flex items-center justify-between p-2 ${isEverythingToggled ? 'bg-accent text-accent-foreground rounded-md' : ''} transition-colors ease-in-out duration-300`}
              >
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium">Everything</p>
                    <p className="text-sm text-muted-foreground">
                      Email digest, mentions & all activity.
                    </p>
                  </div>
                </div>
                <Switch
                  id="notification-everything"
                  checked={isEverythingToggled}
                  onCheckedChange={setIsEverythingToggled}
                />
              </div>
              <div
                className={`flex items-center justify-between p-2 ${isAvailableToggled ? 'bg-accent text-accent-foreground rounded-md' : ''} transition-colors ease-in-out duration-300`}
              >
                <div className="flex items-center space-x-2">
                  <AtSign className="h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium">Available</p>
                    <p className="text-sm text-muted-foreground">
                      Only mentions and comments.
                    </p>
                  </div>
                </div>
                <Switch
                  id="notification-available"
                  defaultChecked
                  checked={isAvailableToggled}
                  onCheckedChange={setIsAvailableToggled}
                />
              </div>
              <div
                className={`flex items-center justify-between p-2 ${isNotificationToggled ? 'bg-accent text-accent-foreground rounded-md' : ''} transition-colors ease-in-out duration-300`}
              >
                <div className="flex items-center space-x-2">
                  <EyeOff className="h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium">Ignoring</p>
                    <p className="text-sm text-muted-foreground">
                      Turn off all notifications.
                    </p>
                  </div>
                </div>
                <Switch
                  id="notification-ignoring"
                  checked={isNotificationToggled}
                  onCheckedChange={setIsNotificationToggled}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Language</CardTitle>
              <CardDescription>
                Update your language preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="grid gap-2">
                <Label htmlFor="language">Language</Label>
                <Select>
                  <SelectTrigger className="text-muted-foreground">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    {/* <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="grid gap-2">
                <Label htmlFor="theme">Theme</Label>
                <Select onValueChange={(value) => setTheme(value)}>
                  <SelectTrigger className="text-muted-foreground">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center">
                        <Icons.sun className="mr-2 h-4 w-4" />
                        <span>Light</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center">
                        <Icons.moon className="mr-2 h-4 w-4" />
                        <span>Dark</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center">
                        <Icons.laptop className="mr-2 h-4 w-4" />
                        <span>System</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="font">Font</Label>
                <Select>
                  <SelectTrigger className="text-muted-foreground">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sans">Sans Serif</SelectItem>
                    <SelectItem value="serif">Serif</SelectItem>
                    <SelectItem value="mono">Monospace</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
