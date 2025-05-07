import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Person as PersonIcon,
  Shield as ShieldIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import axiosInstance from "../../utils/axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/users");
      setUsers(response.data.users);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axiosInstance.delete(`/admin/users/${userId}`);
        await fetchUsers();
      } catch (err) {
        setError("Failed to delete user");
        console.error("Error deleting user:", err);
      }
    }
  };

  // Filter users based on search term and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (roleFilter === "all") return matchesSearch;
    return matchesSearch && user.role === roleFilter;
  });

  const groupedUsers = filteredUsers.reduce(
    (acc, user) => {
      if (user.role === "admin") {
        acc.admins.push(user);
      } else if (user.role === "owner") {
        acc.owners.push(user);
      } else {
        acc.clients.push(user);
      }
      return acc;
    },
    { admins: [] as User[], owners: [] as User[], clients: [] as User[] }
  );

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const renderUserTable = (users: User[], role: string) => (
    <TableContainer component={Paper} className="mb-8">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Joined</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell>
                <div className="flex items-center">
                  {role === "admin" ? (
                    <ShieldIcon className="mr-2 text-purple-500" />
                  ) : role === "owner" ? (
                    <PersonIcon className="mr-2 text-green-600" />
                  ) : (
                    <PersonIcon className="mr-2 text-blue-500" />
                  )}
                  <span className="font-medium">{user.name}</span>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip
                  label={
                    role === "admin"
                      ? "Admin"
                      : role === "owner"
                      ? "Owner"
                      : "Client"
                  }
                  size="small"
                  className={
                    role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : role === "owner"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }
                />
              </TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell align="right">
                {role !== "admin" && (
                  <IconButton
                    onClick={() => handleDelete(user.id)}
                    size="small"
                    title="Delete User"
                  >
                    <DeleteIcon fontSize="small" className="text-red-500" />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4">Users Management</Typography>

        <Box display="flex" gap={2}>
          <TextField
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="role-filter-label">Role</InputLabel>
            <Select
              labelId="role-filter-label"
              id="role-filter"
              value={roleFilter}
              label="Role"
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="owner">Owner</MenuItem>
              <MenuItem value="client">Client</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <CircularProgress />
        </div>
      ) : filteredUsers.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography color="textSecondary">
            No users found matching your criteria.
          </Typography>
        </Box>
      ) : (
        <div>
          {/* Admins Section */}
          {groupedUsers.admins.length > 0 && (
            <div>
              <Typography variant="h6" className="mb-4 flex items-center">
                <ShieldIcon className="mr-2 text-purple-500" />
                Administrators
              </Typography>
              {renderUserTable(groupedUsers.admins, "admin")}
            </div>
          )}

          {/* Owners Section */}
          {groupedUsers.owners.length > 0 && (
            <div>
              <Typography variant="h6" className="mb-4 flex items-center">
                <PersonIcon className="mr-2 text-green-600" />
                Hotel Owners
              </Typography>
              {renderUserTable(groupedUsers.owners, "owner")}
            </div>
          )}

          {/* Regular Users Section */}
          {groupedUsers.clients.length > 0 && (
            <div>
              <Typography variant="h6" className="mb-4 flex items-center">
                <PersonIcon className="mr-2 text-blue-500" />
                Clients
              </Typography>
              {renderUserTable(groupedUsers.clients, "client")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
