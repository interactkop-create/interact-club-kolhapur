import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { settingsAPI } from '../../services/api';
import { useToast } from '../../hooks/use-toast';

export const AdminSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    active_members: 50,
    total_events: 20,
    lives_impacted: 1000,
    awards_won: 5
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get();
      setSettings(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsAPI.update(settings);
      toast({
        title: "Success",
        description: "Settings updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground">Site Settings</h2>
        <p className="text-muted-foreground">Manage website statistics and settings</p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Statistics</CardTitle>
            <CardDescription>
              Update the statistics displayed on the homepage and admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="active_members">Active Members</Label>
                  <Input
                    id="active_members"
                    type="number"
                    value={settings.active_members}
                    onChange={(e) => setSettings({ ...settings, active_members: parseInt(e.target.value) })}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">Number of active club members</p>
                </div>

                <div>
                  <Label htmlFor="total_events">Total Events This Year</Label>
                  <Input
                    id="total_events"
                    type="number"
                    value={settings.total_events}
                    onChange={(e) => setSettings({ ...settings, total_events: parseInt(e.target.value) })}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">Events organized this year</p>
                </div>

                <div>
                  <Label htmlFor="lives_impacted">Lives Impacted</Label>
                  <Input
                    id="lives_impacted"
                    type="number"
                    value={settings.lives_impacted}
                    onChange={(e) => setSettings({ ...settings, lives_impacted: parseInt(e.target.value) })}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">People helped through projects</p>
                </div>

                <div>
                  <Label htmlFor="awards_won">Awards Won</Label>
                  <Input
                    id="awards_won"
                    type="number"
                    value={settings.awards_won}
                    onChange={(e) => setSettings({ ...settings, awards_won: parseInt(e.target.value) })}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">Awards and recognitions received</p>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              How these stats will appear on the homepage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-secondary/30 rounded-lg">
                <div className="text-3xl font-bold text-foreground">{settings.active_members}+</div>
                <div className="text-sm text-muted-foreground mt-1">Active Members</div>
              </div>
              <div className="text-center p-4 bg-secondary/30 rounded-lg">
                <div className="text-3xl font-bold text-foreground">{settings.total_events}+</div>
                <div className="text-sm text-muted-foreground mt-1">Events This Year</div>
              </div>
              <div className="text-center p-4 bg-secondary/30 rounded-lg">
                <div className="text-3xl font-bold text-foreground">{settings.lives_impacted}+</div>
                <div className="text-sm text-muted-foreground mt-1">Lives Impacted</div>
              </div>
              <div className="text-center p-4 bg-secondary/30 rounded-lg">
                <div className="text-3xl font-bold text-foreground">{settings.awards_won}+</div>
                <div className="text-sm text-muted-foreground mt-1">Awards Won</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
