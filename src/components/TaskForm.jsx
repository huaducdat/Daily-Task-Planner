import { useEffect } from "react";
import { Button, Checkbox, DatePicker, Form, Input, Select, Space } from "antd";
import dayjs from "dayjs";

// Chuyển dayjs -> 'YYYY-MM-DD'
const toYMD = (d) => (d ? dayjs(d).format("YYYY-MM-DD") : "");

export default function TaskForm({ initialTask, onSave, onCancel }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialTask) {
      form.setFieldsValue({
        title: initialTask.title,
        category: initialTask.category,
        dueDate: dayjs(initialTask.dueDate, "YYYY-MM-DD"),
        isCompleted: initialTask.isCompleted,
      });
    } else {
      form.setFieldsValue({
        title: "",
        category: "Work",
        dueDate: dayjs(), // hôm nay
        isCompleted: false,
      });
    }
  }, [initialTask, form]);

  const disabledDate = (current) => {
    // Không cho chọn ngày quá khứ
    return current && current.startOf("day").isBefore(dayjs().startOf("day"));
  };

  const onFinish = (values) => {
    const payload = {
      id: initialTask?.id,
      title: values.title.trim(),
      category: values.category,
      dueDate: toYMD(values.dueDate),
      isCompleted: !!values.isCompleted,
    };
    onSave(payload);
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
      requiredMark="optional"
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[
          { required: true, message: "Title is required." },
          { whitespace: true, message: "Title cannot be empty." },
        ]}
      >
        <Input placeholder="e.g., Finish App" />
      </Form.Item>

      <Space align="start" size="large" wrap>
        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Category is required." }]}
          style={{ minWidth: 180 }}
        >
          <Select
            options={[
              { value: "Work", label: "Work" },
              { value: "Personal", label: "Personal" },
              { value: "Study", label: "Study" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Due Date"
          name="dueDate"
          rules={[
            { required: true, message: "Due date is required." },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                if (value.startOf("day").isBefore(dayjs().startOf("day"))) {
                  return Promise.reject(
                    new Error("Due date cannot be in the past.")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" disabledDate={disabledDate} />
        </Form.Item>

        <Form.Item name="isCompleted" valuePropName="checked" label="Completed">
          <Checkbox />
        </Form.Item>
      </Space>

      <Space style={{ marginTop: 8 }}>
        <Button type="primary" htmlType="submit">
          {initialTask ? "Save Changes" : "Save Task"}
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Space>
    </Form>
  );
}
