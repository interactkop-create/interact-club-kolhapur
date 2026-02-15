import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { AlertTriangle, Shield, Save } from 'lucide-react';
import { settingsAPI } from '../../services/api';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

export const AdminSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    active_members: 50,
    total_events: 20,
    lives_impacted: 1000,
    awards_won: 5
  });
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingMaintenance, setTogglingMaintenance] = useState(false);

  const isSuperAdmin = user?.email === 'admin@interactkop.com';

  useEffect(() => {
    fetchSettings();
    fetchMaintenanceStatus();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get();
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaintenanceStatus = async () => {
    try {
      const response = await settingsAPI.getMaintenanceStatus();
      setMaintenanceMode(response.data.maintenance_mode);
    } catch (error) {
      console.error('Error fetching maintenance status:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsAPI.update(settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleMaintenance = async () => {
    if (!window.confirm(
      maintenanceMode 
        ? 'Are you sure you want to DISABLE maintenance mode? The website will be accessible to everyone.'
        : 'Are you sure you want to ENABLE maintenance mode? This will show a maintenance page to ALL visitors!'
    )) {
      return;
    }

    setTogglingMaintenance(true);
    try {
      const response = await settingsAPI.toggleMaintenanceMode();
      setMaintenanceMode(response.data.maintenance_mode);
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error toggling maintenance mode:', error);
      toast.error(error.response?.data?.detail || 'Failed to toggle maintenance mode');
    } finally {
      setTogglingMaintenance(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading settings...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">Manage website statistics and settings</p>
      </div>

      {/* Kill Switch - Only for super admin */}
      {isSuperAdmin && (
        <Card className={`mb-6 ${maintenanceMode ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Kill Switch (Maintenance Mode)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  Status: {maintenanceMode ? (
                    <span className="text-red-600">🔴 MAINTENANCE MODE ACTIVE</span>
                  ) : (
                    <span className="text-green-600">🟢 Website is LIVE</span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {maintenanceMode 
                    ? 'All visitors see a maintenance page. Only admins can access the dashboard.'
                    : 'Website is accessible to everyone.'}
                </p>
              </div>
              <Button
                onClick={handleToggleMaintenance}
                disabled={togglingMaintenance}
                variant={maintenanceMode ? 'default' : 'destructive'}
                className="min-w-[150px]"
              >
                {togglingMaintenance ? 'Processing...' : (
                  maintenanceMode ? 'Disable Kill Switch' : 'Enable Kill Switch'
                )}
              </Button>
            </div>
            {maintenanceMode && (
              <div className="mt-4 p-3 bg-red-100 rounded-lg flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> The website is currently showing a maintenance page to all visitors. 
                  Remember to disable this once the issue is resolved.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Website Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Website Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="active_members">Active Members</Label>
              <Input
                id="active_members"
                type="number"
                value={settings.active_members}
                onChange={(e) => setSettings({ ...settings, active_members: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_events">Total Events</Label>
              <Input
                id="total_events"
                type="number"
                value={settings.total_events}
                onChange={(e) => setSettings({ ...settings, total_events: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lives_impacted">Lives Impacted</Label>
              <Input
                id="lives_impacted"
                type="number"
                value={settings.lives_impacted}
                onChange={(e) => setSettings({ ...settings, lives_impacted: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="awards_won">Awards Won</Label>
              <Input
                id="awards_won"
                type="number"
                value={settings.awards_won}
                onChange={(e) => setSettings({ ...settings, awards_won: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="mt-4">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Statistics'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
