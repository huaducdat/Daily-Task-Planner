import { useEffect, useMemo, useState } from "react";
import "normalize.css";
import "antd/dist/reset.css";
import {
  App as AntApp,
  Button,
  Card,
  Divider,
  Flex,
  Modal,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { HashRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import dayjs from "dayjs";
import { Box } from "@mui/material"; // MUI dùng phụ cho layout/spacing

// ===== Task Model =====
// {
//   id: string,
//   title: string,
//   category: string,  // Work | Personal | Study | ...
//   dueDate: string,   // YYYY-MM-DD
//   isCompleted: boolean
// }

const initialTasks = [
  {
    id: "t1",
    title: "Finish App",
    category: "Work",
    dueDate: "2024-07-01",
    isCompleted: false,
  },
  {
    id: "t2",
    title: "Gym",
    category: "Personal",
    dueDate: "2024-07-02",
    isCompleted: true,
  },
];

function PlannerPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState("All"); // All | Completed | Incomplete
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // task or null

  useEffect(() => {
    document.title = "Daily Task Planner";
  }, []);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (task) => {
    setEditing(task);
    setFormOpen(true);
  };

  const onCancelForm = () => {
    setEditing(null);
    setFormOpen(false);
  };

  const addTask = (newTask) => {
    setTasks((prev) => [{ ...newTask, id: crypto.randomUUID() }, ...prev]);
    onCancelForm();
  };

  const updateTask = (updated) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    onCancelForm();
  };

  const deleteTask = (id) => {
    Modal.confirm({
      title: "Delete Task",
      content: "Are you sure you want to delete this task?",
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      },
    });
  };

  const filteredTasks = useMemo(() => {
    if (filter === "Completed") return tasks.filter((t) => t.isCompleted);
    if (filter === "Incomplete") return tasks.filter((t) => !t.isCompleted);
    return tasks;
  }, [filter, tasks]);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.isCompleted).length;
  const incomplete = total - completed;

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 2 }}>
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <Flex align="center" justify="space-between">
          <Typography.Title level={3} style={{ margin: 0 }}>
            Daily Task Planner
          </Typography.Title>
          <Space>
            <Select
              value={filter}
              style={{ width: 160 }}
              onChange={setFilter}
              options={[
                { value: "All", label: "Show: All" },
                { value: "Completed", label: "Show: Completed" },
                { value: "Incomplete", label: "Show: Incomplete" },
              ]}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
              Add Task
            </Button>
          </Space>
        </Flex>

        <Card>
          {/* Summary */}
          <Space wrap>
            <Statistic title="Total Tasks" value={total} />
            <Statistic title="Completed" value={completed} />
            <Statistic title="Incomplete" value={incomplete} />
          </Space>

          <Divider />

          {/* Table + actions */}
          <TaskList
            tasks={filteredTasks}
            onEdit={openEdit}
            onDelete={deleteTask}
          />
        </Card>
      </Space>

      {/* Form Modal (Ant) */}
      <Modal
        title={editing ? "Edit Task" : "Add Task"}
        open={formOpen}
        onCancel={onCancelForm}
        footer={null}
        destroyOnClose
      >
        <TaskForm
          initialTask={editing}
          onSave={(task) => (editing ? updateTask(task) : addTask(task))}
          onCancel={onCancelForm}
        />
      </Modal>
    </Box>
  );
}

export default function App() {
  // Hash routing đơn giản: / => Planner
  return (
    <AntApp>
      <Routes>
        <Route path="/" element={<PlannerPage />} />
        {/* Ví dụ thêm 1 route phụ */}
        <Route
          path="/about"
          element={
            <div style={{ padding: 16 }}>
              <Typography.Title level={4}>About</Typography.Title>
              <Typography.Text>
                This is a simple local-state React app for the assessment.
              </Typography.Text>
              <div style={{ marginTop: 12 }}>
                <Link to="/">Back to Planner</Link>
              </div>
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AntApp>
  );
}
