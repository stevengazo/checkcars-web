import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa6";
import PageHeader from "../Components/templates/PageHeader";
import Button from "../Components/atoms/Button";
import Modal from "../Components/molecules/Modal";
import CarTable from "../Components/organisms/CarTable";
import CarForm from "../Components/organisms/CarForm";

const CarList = () => {
  const [addOpen, setAddOpen] = useState(false);
  const tableRef = useRef(null);

  const handleSuccess = () => {
    setAddOpen(false);
    tableRef.current?.refresh();
  };

  return (
    <motion.div
      className="p-2 sm:p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <PageHeader
        title="Vehículos"
        action={
          <Button onClick={() => setAddOpen(true)} variant="outline">
            <FaPlus /> Agregar Auto
          </Button>
        }
      />

      <CarTable ref={tableRef} />

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Agregar Nuevo Vehículo">
        <CarForm onSuccess={handleSuccess} onCancel={() => setAddOpen(false)} />
      </Modal>
    </motion.div>
  );
};

export default CarList;
