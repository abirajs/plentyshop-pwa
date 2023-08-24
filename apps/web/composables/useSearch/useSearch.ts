import { ItemSearchParams, ItemSearchResult } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import { defaults } from '~/composables';
import { UseSearchReturn, UseSearchState, GetSearch } from '~/composables/useSearch/types';
import { useSdk } from '~/sdk';

/**
 * @description Composable for managing products.
 * @returns {@link UseProducts}
 * @example
 * const { data, loading, fetchProducts } = useProducts();
 */
export const useSearch: UseSearchReturn = () => {
  const state = useState<UseSearchState>('search', () => ({
    data: {} as ItemSearchResult,
    loading: false,
    productsPerPage: defaults.DEFAULT_ITEMS_PER_PAGE,
  }));

  /**
   * @description Function for fetching products.
   * @example
   * getFacet(@props: FacetSearchCriteria)
   */
  const getSearch: GetSearch = async (params: ItemSearchParams) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getSearch(params));
    useHandleError(error.value);

    state.value.productsPerPage = params.itemsPerPage || defaults.DEFAULT_ITEMS_PER_PAGE;

    if (data.value) data.value.data.pagination.perPageOptions = defaults.PER_PAGE_STEPS;

    state.value.data = data.value?.data ?? state.value.data;

    state.value.loading = false;
    return state.value.data;
  };

  return {
    getSearch,
    ...toRefs(state.value),
  };
};
