import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we will take care of everything
    read(existing = [], { args, cache }) {
      console.log({ existing, args, cache });
      const { skip, first } = args;

      // read the number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);
      // check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      // if
      // there are items
      // And there arent enough items to satisfy how many were rested
      // aand we are on the last page
      //then send it
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // we dont have any items we must go to the network to fetch them
        return false;
      }
      // if there are items just return them from the cache, and we dont need to go to the network

      if (items.length) {
        console.log(`There are ${items.length} items in the cache! Gonna send them to apollo`);
        return items;
      }

      return false; // fall back to network
      // First thing it does it asks the read function for those times
      // we can either do one of two things:
      // First things we can do is return the items because they are already in the cache
      // the other thing we can do is return false from here
    },

    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // This runs when the appollo client commes back from the netrwork with our products
      console.log(`Merging items from the network ${incoming.length}`);
      const merged = existing ? existing.slice(0) : [];

      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      console.log(merged);
      // finally we return the merged items from the cache
      return merged;
    },
  };
}
