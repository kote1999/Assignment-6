//By Konstantine Kirkitadze

interface movieInterface {
    Year: number, 
    Actors: string,
    Country: string,
    Runtime: string
}

type myCountryType = {
    currencies: {code: string}[],
    population: number
}[]; 

 

const getMovie = (name: string): Promise<movieInterface>  =>
  fetch(`http://www.omdbapi.com/?t=${name}&apikey=540d1872`).then((res) =>
    res.json()
  );

const getCountry = (name: string): Promise<myCountryType>  =>
  fetch(`https://restcountries.eu/rest/v2/name/${name}?fullText=true`).then(
    (res) => res.json()
  );

const logger = (p: Promise<number | string | string[]>): void => {
    p.then((r) => console.log(r))
};

// 1. დაწერეთ ფუნქცია, რომელსაც გადავცემთ ფილმის სახელს და გვეტყვის რამდენი წლის წინ გამოვიდა ეს ფილმი.

const yearsPassed = (movieName: string): Promise<number> =>
  getMovie(movieName).then((m) => new Date().getFullYear() - m.Year);

logger(yearsPassed("Avatar"));

// // 2. დაწერეთ ფუნქცია, რომელსაც გადავცემთ ფილმის სახელს და დაგვიბრუნებს ამ ფილმის მსახიობების სახელების მასივს (გვარების გარეშე)

const getNamesOnly = (movieName: string): Promise<string[]> =>
  getMovie(movieName).then((m) =>
    m.Actors?.split(", ").map((m) => m.split(" ")[0])
  );

 logger(getNamesOnly("Gzaabneulni"));

// 3. დაწერეთ ფუნქცია, რომელიც დააბრუნებს იმ ქვეყნის ვალუტას, საიდანაც თქვენი  ერთერთი საყვარელი ფილმია. (თუ რამდენიმე ქვეყანაა ფილმზე მითითებული,  ავიღოთ პირველი)

const getMovieCountryCurrency = (movieName: string): Promise<string> =>
  getMovie(movieName)
    .then(res => res.Country?.split(", ")[0])
    .then((el) => getCountry(el))
    .then(el => el[0]?.currencies[0]?.code);


logger(getMovieCountryCurrency('avatar'));

// 5. დაწერეთ ფუნქცია, რომელსაც გადავცემთ 3 ფილმის სახელს, და დაგვიბრუნებს იმ ქვეყნების მოსახლეობების ჯამს, საიდანაც ეს ფილმებია. (თუ რამდენიმე ქვეყანაა ფილმზე მითითებული, ავიღოთ პირველი)

const parseCountry = (countries: string): string => countries.split(", ")[0];

const getTotalPopulation = ([movieA, movieB, movieC]: Promise<movieInterface>[]): Promise<number> =>
  Promise.all([movieA, movieB, movieC]).then(([a, b, c]) =>
    Promise.all([
      getCountry(parseCountry(a.Country)),
      getCountry(parseCountry(b.Country)),
      getCountry(parseCountry(c.Country)),
    ]).then((allCountries) =>
      allCountries.reduce((acc, curr) => (acc += curr[0].population), 0)
    )
  );

logger(
  getTotalPopulation([
    getMovie("Disco Dancer"),
    getMovie("Gzaabneulni"),
    getMovie("Lord of the Rings"),
  ])
);

// 4. დაწერეთ ფუნქცია, რომელსაც გადავცემთ 3 ფილმის სახელს, და გვეტყვის ჯამში რამდენი საათი და რამდენი წუთია ყველა ფილმის ხანგრძლივობა ერთად.

const getTotalDuration = ([movieA, movieB, movieC]: Promise<movieInterface>[]): Promise<string> =>
  Promise.all([movieA, movieB, movieC])
    .then((arr) =>
      arr
        .map((x) => parseInt(x.Runtime))
        .reduce((acc, curr) => (acc += curr), 0)
    )
    .then(
      (minutes) => `${Math.floor(minutes / 60)} hours, ${minutes % 60} minutes`
    );

logger(
  getTotalDuration([
    getMovie("Disco Dancer"),
    getMovie("Gzaabneulni"),
    getMovie("Lord of the Rings"),
  ])
);