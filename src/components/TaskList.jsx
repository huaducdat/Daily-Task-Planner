import { Button, Table, Tag, Space, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function TaskList({ tasks, onEdit, onDelete }) {
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (c) => (
        <Tag
          color={c === "Work" ? "blue" : c === "Personal" ? "green" : "purple"}
        >
          {c}
        </Tag>
      ),
      width: 140,
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 140,
    },
    {
      title: "Completed",
      dataIndex: "isCompleted",
      key: "isCompleted",
      width: 120,
      render: (v) =>
        v ? <Tag color="geekblue">Yes</Tag> : <Tag color="default">No</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={tasks}
      pagination={{ pageSize: 5 }}
      scroll={{ x: 640 }}
    />
  );
}
