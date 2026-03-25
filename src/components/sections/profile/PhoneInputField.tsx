import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

interface PhoneInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  defaultCountry?: string;
  disabled?: boolean;
}

export const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  value,
  onChange,
  defaultCountry = 'us',
  disabled = false,
}) => {
  return (
    <PhoneInput
      defaultCountry={defaultCountry}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{ width: '100%' }}
      inputStyle={{
        width: '100%',
        height: '40px',
        fontSize: '14px',
        borderColor: '#c4c4c4',
        borderRadius: '0 4px 4px 0',
        borderLeft: 'none',
      }}
      countrySelectorStyleProps={{
        buttonStyle: {
          height: '40px',
          borderColor: '#c4c4c4',
          borderRadius: '4px 0 0 4px',
          borderRight: 'none',
          backgroundColor: 'white',
          paddingLeft: '8px',
          paddingRight: '8px',
        },
      }}
    />
  );
};