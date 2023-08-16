import type { PaymentProviders } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import { toRefs } from '@vueuse/shared';
import { useSdk } from '~/sdk';
import { UsePaymentMethodsReturn, UsePaymentMethodsState, FetchPaymentMethods, SavePaymentMethod } from './types';

/**
 * @description Composable for getting payment methods.
 * @example
 * const { data, loading, fetchPaymentMethods, savePaymentMethod } = usePaymentMethods();
 */

export const usePaymentMethods: UsePaymentMethodsReturn = () => {
  const state = useState<UsePaymentMethodsState>('usePaymentMethods', () => ({
    data: {} as PaymentProviders,
    loading: false,
  }));

  /**
   * @description Function for fetching payment methods.
   * @example
   * fetchPaymentMethods();
   */

  const fetchPaymentMethods: FetchPaymentMethods = async () => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getPaymentProviders());
    useHandleError(error.value);
    state.value.data = data.value?.data ?? state.value.data;
    state.value.loading = false;
    return state.value.data;
  };

  /**
   * @description Function to set payment method id.
   * @example
   * savePaymentMethod(1);
   */

  const savePaymentMethod: SavePaymentMethod = async (paymentMethodId: number) => {
    state.value.loading = true;
    const { error } = await useAsyncData(() =>
      useSdk().plentysystems.setPaymentProvider({
        paymentId: paymentMethodId,
      }),
    );
    useHandleError(error.value);
    state.value.loading = false;
  };

  return {
    fetchPaymentMethods,
    savePaymentMethod,
    ...toRefs(state.value),
  };
};
