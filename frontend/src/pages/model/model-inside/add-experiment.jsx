import { Modal } from "antd";

const AddExperimentManual = ({ open, onClose }) => {
    return <Modal
        title="Add Experiment"
        open={open}
        onClose={onClose}
        onCancel={onClose}
    >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
    </Modal>;
};

export default AddExperimentManual;