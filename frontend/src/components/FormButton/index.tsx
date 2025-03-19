import { motion } from "framer-motion";
interface FormButtonProps {
  text: string;
  color: string;
  textColor: string;
  buttonType: "submit" | "reset" | "button";
}

const FormButton: React.FC<FormButtonProps> = ({
  text,
  color,
  textColor,
  buttonType,
}) => {
  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className={`w-fit rounded-full px-6 py-3 text-${textColor} ${color} hover:bg-opacity-80`}
        aria-label={text}
        type={buttonType}
      >
        {text}
      </motion.button>
    </>
  );
};

export default FormButton;
