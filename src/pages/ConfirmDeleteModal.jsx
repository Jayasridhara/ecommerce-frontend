// src/components/ConfirmDeleteModal.jsx
import { AnimatePresence, motion } from "framer-motion";

export default function ConfirmDeleteModal({
  show,
  onConfirm,
  onCancel,
  message = "Are you sure you want to delete this item?",
}) {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="text-xl font-bold text-black mb-3">Confirm Delete</h2>
          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex justify-center gap-4">
            <button
              onClick={onCancel}
              className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
