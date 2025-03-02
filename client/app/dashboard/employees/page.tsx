"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { API_URL } from "@/lib/constants";
import axios from "axios";
import { Plus, Trash2, Pencil } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Employee {
  _id: string;
  employeeNo: number;
  fullName: string;
  joiningDate: string;
  resignDate: string;
  department: string;
  floor: string;
  emailId: string;
  skypeId: string;
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    employeeNo: "",
    fullName: "",
    joiningDate: "",
    resignDate: "",
    department: "",
    floor: "",
    emailId: "",
    skypeId: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/employees`);
      setEmployees(response.data.employees || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await axios.put(`${API_URL}/employees/${editingEmployee._id}`, formData);
      } else {
        await axios.post(`${API_URL}/employees`, formData);
      }
      setDialogOpen(false);
      setEditingEmployee(null);
      resetForm();
      fetchEmployees();
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      employeeNo: employee.employeeNo.toString(),
      fullName: employee.fullName,
      joiningDate: employee.joiningDate,
      resignDate: employee.resignDate,
      department: employee.department,
      floor: employee.floor,
      emailId: employee.emailId,
      skypeId: employee.skypeId,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (employeeId: string) => {
    try {
      await axios.delete(`${API_URL}/employees/${employeeId}`);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      employeeNo: "",
      fullName: "",
      joiningDate: "",
      resignDate: "",
      department: "",
      floor: "",
      emailId: "",
      skypeId: "",
    });
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingEmployee(null);
      resetForm();
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-lg font-semibold">Employee Management</h2>
        <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {editingEmployee ? "Edit Employee" : "Add New Employee"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Employee Number *
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter employee number"
                    value={formData.employeeNo}
                    onChange={(e) => handleInputChange("employeeNo", e.target.value)}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Full Name *
                  </label>
                  <Input
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Joining Date *
                  </label>
                  <Input
                    type="date"
                    placeholder="Select joining date"
                    value={formData.joiningDate}
                    onChange={(e) => handleInputChange("joiningDate", e.target.value)}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Resign Date
                  </label>
                  <Input
                    type="date"
                    placeholder="Select resign date"
                    value={formData.resignDate}
                    onChange={(e) => handleInputChange("resignDate", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Department *
                  </label>
                  <Input
                    placeholder="Enter department"
                    value={formData.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Floor *
                  </label>
                  <Input
                    placeholder="Enter floor"
                    value={formData.floor}
                    onChange={(e) => handleInputChange("floor", e.target.value)}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Email ID *
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={formData.emailId}
                    onChange={(e) => handleInputChange("emailId", e.target.value)}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Skype ID
                  </label>
                  <Input
                    placeholder="Enter Skype ID"
                    value={formData.skypeId}
                    onChange={(e) => handleInputChange("skypeId", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  Fields marked with * are required
                </p>
                <Button type="submit" className="w-full">
                  {editingEmployee ? "Update Employee" : "Add Employee"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Emp No</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Floor</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joining Date</TableHead>
              <TableHead>Resign Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  {isLoading ? "Loading employees..." : "No employees found"}
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee._id}>
                  <TableCell>{employee.employeeNo}</TableCell>
                  <TableCell>{employee.fullName}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.floor}</TableCell>
                  <TableCell>{employee.emailId}</TableCell>
                  <TableCell>{new Date(employee.joiningDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {employee.resignDate !== "N/A" 
                      ? new Date(employee.resignDate).toLocaleDateString() 
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(employee)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-destructive/90 hover:text-destructive-foreground"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete employee &ldquo;{employee.fullName}&rdquo;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(employee._id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
