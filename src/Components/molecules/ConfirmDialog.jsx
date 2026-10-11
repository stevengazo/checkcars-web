import Modal from "./Modal";
import Button from "../atoms/Button";

/** Diálogo de confirmación para acciones destructivas. */
const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  loading = false,
  tone = "danger",
}) => (
  <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-md">
    <p className="text-sm text-gray-600">{message}</p>
    <div className="mt-6 flex justify-end gap-2">
      <Button variant="secondary" onClick={onClose} disabled={loading}>
        {cancelLabel}
      </Button>
      <Button variant={tone} onClick={onConfirm} loading={loading}>
        {confirmLabel}
      </Button>
    </div>
  </Modal>
);

export default ConfirmDialog;
