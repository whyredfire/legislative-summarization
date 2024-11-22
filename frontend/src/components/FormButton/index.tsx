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
      <button
        className={`rounded-full px-6 py-3 w-fit text-${textColor} ${color} hover:bg-opacity-80`}
        aria-label={text}
        type={buttonType}
      >
        {text}
      </button>
    </>
  );
};

export default FormButton;
