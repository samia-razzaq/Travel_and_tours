import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Package {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price: number | null;
  image_url: string;
  category: string;
  duration: string;
  group_size: string;
  time_of_day: string[];
  activity_level: string;
  tags: string[];
}

export default function Admin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Package>>({
    title: "",
    description: "",
    price: 0,
    original_price: null,
    image_url: "",
    category: "adventure",
    duration: "",
    group_size: "any",
    time_of_day: [],
    activity_level: "medium",
    tags: [],
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      if (error) throw error;

      const hasAdminRole = roles?.some(r => r.role === "admin");
      
      if (!hasAdminRole) {
        toast.error("You don't have admin access");
        navigate("/");
        return;
      }

      setIsAdmin(true);
      loadPackages();
    } catch (error: any) {
      console.error("Error checking admin access:", error);
      toast.error("Failed to verify admin access");
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const loadPackages = async () => {
    try {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .order("title");

      if (error) throw error;
      setPackages(data || []);
    } catch (error: any) {
      toast.error("Failed to load packages");
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const openDialog = (pkg: Package | null = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData(pkg);
    } else {
      setEditingPackage(null);
      setFormData({
        title: "",
        description: "",
        price: 0,
        original_price: null,
        image_url: "",
        category: "adventure",
        duration: "",
        group_size: "any",
        time_of_day: [],
        activity_level: "medium",
        tags: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!formData.title || !formData.description || !formData.price || !formData.image_url || !formData.category || !formData.duration || !formData.group_size || !formData.activity_level) {
        toast.error("Please fill all required fields");
        return;
      }

      const packageData = {
        id: editingPackage?.id || formData.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        title: formData.title,
        description: formData.description,
        price: formData.price,
        original_price: formData.original_price,
        image_url: formData.image_url,
        category: formData.category,
        duration: formData.duration,
        group_size: formData.group_size,
        time_of_day: formData.time_of_day || [],
        activity_level: formData.activity_level,
        tags: formData.tags || [],
      };

      if (editingPackage) {
        const { error } = await supabase
          .from("packages")
          .update(packageData)
          .eq("id", editingPackage.id);

        if (error) throw error;
        toast.success("Package updated successfully");
      } else {
        const { error } = await supabase
          .from("packages")
          .insert([packageData]);

        if (error) throw error;
        toast.success("Package created successfully");
      }

      setIsDialogOpen(false);
      loadPackages();
    } catch (error: any) {
      toast.error(error.message || "Failed to save package");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      const { error } = await supabase
        .from("packages")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Package deleted successfully");
      loadPackages();
    } catch (error: any) {
      toast.error("Failed to delete package");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage tour packages</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
            <Button onClick={() => openDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Package
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Packages ({packages.length})</CardTitle>
            <CardDescription>View and manage all tour packages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">{pkg.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{pkg.category}</Badge>
                      </TableCell>
                      <TableCell>${pkg.price}</TableCell>
                      <TableCell>{pkg.duration}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDialog(pkg)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(pkg.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPackage ? "Edit Package" : "Add New Package"}</DialogTitle>
              <DialogDescription>
                {editingPackage ? "Update package details" : "Create a new tour package"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="original_price">Original Price</Label>
                  <Input
                    id="original_price"
                    type="number"
                    value={formData.original_price || ""}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value ? parseFloat(e.target.value) : null })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image_url">Image URL *</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="relaxation">Relaxation</SelectItem>
                      <SelectItem value="sightseeing">Sightseeing</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 6 hours"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="group_size">Group Size *</Label>
                  <Select
                    value={formData.group_size}
                    onValueChange={(value) => setFormData({ ...formData, group_size: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="couple">Couple</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="activity_level">Activity Level *</Label>
                  <Select
                    value={formData.activity_level}
                    onValueChange={(value) => setFormData({ ...formData, activity_level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="extreme">Extreme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time_of_day">Time of Day (comma-separated)</Label>
                <Input
                  id="time_of_day"
                  placeholder="morning, evening"
                  value={formData.time_of_day?.join(", ")}
                  onChange={(e) => setFormData({ ...formData, time_of_day: e.target.value.split(",").map(s => s.trim()) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="dune-bashing, camel-ride"
                  value={formData.tags?.join(", ")}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(",").map(s => s.trim()) })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Package"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}