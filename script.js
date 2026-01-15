// function debounce(hashir){
//      console.log(hashir())
//      return hashir
// }

// function fetchResults () {
//    const a = 78
//    return a 
// }
// const debouncedFetch = debounce(fetchResults)


// let count = 1
// debouncedFetch(count)


function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args)
    }, delay);
  };
}

const fetchResults = async (search) => {
    console.log(search)
    }

const debouncedFetch = debounce(fetchResults,1000);

debouncedFetch('quer');
debouncedFetch('qu');
debouncedFetch('d');
debouncedFetch('has');
debouncedFetch('que');
debouncedFetch('hashir');










