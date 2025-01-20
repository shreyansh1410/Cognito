import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  isGoogleAuth?: boolean;
}

export function ProfilePage() {
  const { updateUserInContext } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();
      // Determine if user is Google-authenticated (no password field)
      const isGoogleAuth = !data.password;
      setProfile({ ...data, isGoogleAuth });
      setLoading(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile data",
      });
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedUser = await response.json();
      updateUserInContext(updatedUser);

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New passwords don't match",
      });
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/profile/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update password");
      }

      toast({
        title: "Success",
        description: "Password updated successfully",
      });

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update password",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        activeFilter="all"
        onFilterChange={() => {}}
      /> */}
      <main
        className={`flex-1 overflow-auto transition-all duration-300 ${
          isSidebarCollapsed ? "ml-16" : "ml-18"
        }`}
      >
        {/* <Header openAddContentModal={() => {}} showControls={false} /> */}
        <div className="container mx-auto py-8 max-w-2xl">
          <div className="space-y-6">
            {/* Profile Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your personal information and bio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) =>
                          setProfile({ ...profile, firstName: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) =>
                          setProfile({ ...profile, lastName: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                      disabled={!isEditing}
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    {!isEditing ? (
                      <Button type="button" onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                          {saving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Password Change Card - Only show for non-Google auth users */}
            {!profile.isGoogleAuth && (
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your account password
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwords.currentPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            currentPassword: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwords.newPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            newPassword: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={saving}>
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating Password
                          </>
                        ) : (
                          "Update Password"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
