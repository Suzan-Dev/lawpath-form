import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import InputField from './InputField';

describe('InputField component', () => {
  it('renders an input field with a label', () => {
    const label = 'Example Label';

    render(<InputField name='example' label={label} value='' onChange={() => {}} />);

    expect(screen.getByLabelText(label)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders an error message when error prop is true', () => {
    const errorMsg = 'This field is required';
    render(
      <InputField
        name='example'
        label='Example Label'
        value=''
        error={true}
        errorMsg={errorMsg}
        onChange={() => {}}
      />
    );

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it('calls the onChange callback when the input value changes', async () => {
    const onChangeMock = jest.fn();
    const user = userEvent.setup();
    const value = 'a';

    render(<InputField name='example' label='Example Label' value='' onChange={onChangeMock} />);

    await user.type(screen.getByRole('textbox'), value);
    expect(onChangeMock).toHaveBeenCalledWith(value);
  });
});
