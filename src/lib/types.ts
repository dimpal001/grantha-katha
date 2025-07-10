export interface User {
  id: number
  name: string
  email: string
  password: string
  role: "admin" | "manager" | "user"
  status: "active" | "inactive"
  created_at: string
  lastLogin: string | null
}

export interface Department {
  id: number
  name: string
  description: string
  manager: number
  user_ids: number[]
  created_at: string
}

export interface Project {
  id: number
  name: string
  description: string
  department_ids: number[]
  status: string
  start_date: string
  end_date: string
  assignedUsers: number[]
  progress: number
  created_at: string
}

export interface Task {
  id: number
  title: string
  description: string
  project_id: number
  assignedTo: number
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate: string
  created_at: string
  updatedAt: string
}

export interface Attendance {
  id: number
  user_id: number
  date: string
  check_in: string
  check_out: string | null
  location: {
    latitude: number | null
    longitude: number | null
    address: string
  }
  status: string
}

export interface Timesheet {
  id: number
  user_id: number
  project_id: number
  date: string
  hours: number
  description: string
  submitted_at: string
  status: string
}

export interface Activity {
  id: number
  user_id: number
  description: string
  timestamp: string
  type: string
}
