import { Form, Input, InputNumber } from "antd";

const FormMySQL = ({ form }) => {
    return (
        <Form
            form={form}
            layout="vertical"
        >
            <h4>General</h4>
            <Form.Item label="Name" name="name" rules={[{ required: true, message: "Name is required" }]}>
                <Input placeholder="Enter the name of the data source" />
            </Form.Item>
            <Form.Item label="Description" name="description">
                <Input placeholder="Enter the description of the data source" />
            </Form.Item>
            <Form.Item label="Host" name="host" rules={[{ required: true, message: "Host is required" }]}>
                <Input placeholder="Enter the host of the MySQL database" />
            </Form.Item>
            <Form.Item label="Port" name="port" rules={[{ required: true, message: "Port is required" }]}>
                <InputNumber 
                    style={{ width: "100% "}} 
                    placeholder="Enter the port of the MySQL database" 
                />
            </Form.Item>
            <h4>Authentication</h4>
            <Form.Item label="Username" name="username" rules={[{ required: true, message: "Username is required" }]}>
                <Input placeholder="Enter the username of the MySQL database" />
            </Form.Item>
            <Form.Item label="Password" name="password" rules={[{ required: true, message: "Password is required" }]}>
                <Input.Password placeholder="Enter the password of the MySQL database" />
            </Form.Item>
            <Form.Item label="Database Identifier" name="database" rules={[{ required: true, message: "Database Identifier is required" }]}>
                <Input placeholder="Enter the database name" />
            </Form.Item>
        </Form>
    );
};

export default FormMySQL;