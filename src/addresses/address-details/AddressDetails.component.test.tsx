import { fireEvent, render, screen } from '@testing-library/react';
import { AddressDetails } from './AddressDetails.component';
import { useJolokiaServiceReadAddressAttributes } from '../../openapi/jolokia/queries';
import { AuthContext } from '../../jolokia/customHooks';

jest.mock('../../openapi/jolokia/queries', () => ({
  useJolokiaServiceReadAddressAttributes: jest.fn(),
}));

describe('AddressDetails', () => {
  const mockData = [
    { request: { attribute: 'Address' }, value: 'DLQ' },
    { request: { attribute: 'AddressSize' }, value: 0 },
    { request: { attribute: 'AutoCreated' }, value: false },
    { request: { attribute: 'MessageCount' }, value: 0 },
    { request: { attribute: 'RoutingTypes' }, value: 'Anycast' },
    { request: { attribute: 'BindingNames' }, value: 'DLQ' },
    { request: { attribute: 'CurrentDuplicateIdCacheSize' }, value: 0 },
    { request: { attribute: 'Internal' }, value: false },
    { request: { attribute: 'AddressLimitPercent' }, value: 0 },
    { request: { attribute: 'NumberOfBytesPerPage' }, value: 1245 },
    { request: { attribute: 'NumberOfMessages' }, value: 0 },
    { request: { attribute: 'QueueNames' }, value: 'DLQ' },
  ];

  beforeEach(() => {
    (useJolokiaServiceReadAddressAttributes as jest.Mock).mockReturnValue({
      data: mockData,
      isSuccess: true,
      error: null,
    });
  });

  it('should renders data correctly when fetch is successful', () => {
    render(
      <AuthContext.Provider value="mock-token">
        <AddressDetails name="DLQ" />
      </AuthContext.Provider>,
    );

    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('AddressSize')).toBeInTheDocument();
    expect(screen.getByText('AutoCreated')).toBeInTheDocument();
    expect(screen.getByText('MessageCount')).toBeInTheDocument();
    expect(screen.getByText('RoutingTypes')).toBeInTheDocument();
  });

  it('should renders loading spinner initially when data not available', () => {
    (useJolokiaServiceReadAddressAttributes as jest.Mock).mockReturnValueOnce({
      data: null,
      isSuccess: false,
      error: null,
    });

    render(
      <AuthContext.Provider value="mock-token">
        <AddressDetails name="DLQ" />
      </AuthContext.Provider>,
    );

    expect(screen.getByText('attributes')).toBeInTheDocument();
  });

  it('should filters the data based on search input', () => {
    render(
      <AuthContext.Provider value="mock-token">
        <AddressDetails name="DLQ" />
      </AuthContext.Provider>,
    );

    const searchInput = screen.getByPlaceholderText('search');
    fireEvent.change(searchInput, { target: { value: 'Message' } });

    expect(screen.getByText('MessageCount')).toBeInTheDocument();
    expect(screen.queryByText('Address')).not.toBeInTheDocument();
  });

  it('should clear the search input and reset the initial data when search input is cleared', () => {
    render(
      <AuthContext.Provider value="mock-token">
        <AddressDetails name="DLQ" />
      </AuthContext.Provider>,
    );
    //initial data rendered
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('AddressSize')).toBeInTheDocument();
    expect(screen.getByText('AutoCreated')).toBeInTheDocument();
    expect(screen.getByText('MessageCount')).toBeInTheDocument();
    expect(screen.getByText('RoutingTypes')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('search');
    fireEvent.change(searchInput, { target: { value: 'Message' } });

    fireEvent.change(searchInput, { target: { value: '' } });
    expect(searchInput).toBeInTheDocument();
    //Verify that the initial data is displayed again
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('AddressSize')).toBeInTheDocument();
    expect(screen.getByText('AutoCreated')).toBeInTheDocument();
    expect(screen.getByText('MessageCount')).toBeInTheDocument();
    expect(screen.getByText('RoutingTypes')).toBeInTheDocument();
  });

  it('should update the current page when pagination controls are used', () => {
    const { container } = render(
      <AuthContext.Provider value="mock-token">
        <AddressDetails name="DLQ" />
      </AuthContext.Provider>,
    );

    const initialTextInput = container.querySelector(
      '#pagination-options-menu-top-top-pagination > nav > div:nth-child(3) > input',
    );
    expect(initialTextInput).toHaveValue(1);

    fireEvent.click(
      screen.getAllByRole('button', { name: /go to next page/i })[0],
    );

    const updateTextInput = container.querySelector(
      '#pagination-options-menu-top-top-pagination > nav > div:nth-child(3) > input',
    );
    expect(updateTextInput).toHaveValue(2);
  });

  it('should display the error message when data is not available and failure', () => {
    (useJolokiaServiceReadAddressAttributes as jest.Mock).mockReturnValueOnce({
      data: null,
      isSuccess: false,
      error: true,
    });
    render(
      <AuthContext.Provider value="mock-token">
        <AddressDetails name="DLQ" />
      </AuthContext.Provider>,
    );
    expect(screen.getByText('error_loading')).toBeInTheDocument();
  });
});
