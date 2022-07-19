import "./App.css";
import sortBy from "lodash/sortBy";
import filter from "lodash/filter";
import Counter from "./Counter";
import React from "react";

// const bannedPickNumber = [1, 2, 3, 4, 9, 10, 11, 12, 13, 14, 19, 20, 21, 22];

function App() {
  // const [pickedNumber, setPickedNumber] = React.useState(1);
  const [heroes, setHeroes] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");
  const [searchHeroes, setSearchedHeroes] = React.useState([]);
  const [currentSide, setCurrentSide] = React.useState("DIRE");
  const [radiantHeroes, setRadiantHeroes] = React.useState([]);
  // const [radiantBannedHeroes, setRadiantBannedHeroes] = React.useState([]);
  const [direHeroes, setDireHeroes] = React.useState([]);
  // const [direBannedHeroes, setDireBannedHeroes] = React.useState([]);

  // console.log(heroes, "heroes");
  // console.log({ radiantHeroes, direHeroes });

  React.useEffect(() => {
    if (searchText === "") return;

    const filteredHero = filter(heroes, (o) => {
      return o.localized_name.toLowerCase().indexOf(searchText) > -1;
    }).map((data) => data.localized_name);

    setSearchedHeroes(filteredHero);

    const timer = setTimeout(() => {
      setSearchText("");
    }, 2000);
    return () => clearTimeout(timer);
  }, [heroes, searchText]);

  React.useEffect(() => {
    fetch("https://api.opendota.com/api/heroes")
      .then((res) => res.json())
      .then((data) => {
        const dataWithImage =
          data.length &&
          data.map((hero) => {
            const heroName = hero.name.split("npc_dota_hero_").pop();
            return {
              ...hero,
              img: `https://cdn.stratz.com/images/dota2/heroes/${heroName}_vert.png`,
            };
          });
        const sortedHeroes = sortBy(dataWithImage, [(o) => o.localized_name]);
        setHeroes(sortedHeroes);
      });
  }, []);

  const onKeyDown = (e) => {
    if (e.keyCode === 27) {
      setSearchText("");
      setSearchedHeroes("");
    }
    if (
      (e.keyCode > 64 && e.keyCode < 91) ||
      (e.keyCode > 96 && e.keyCode < 123)
    ) {
      setSearchText((prev) => {
        return `${prev}${e.key}`;
      });
    }
  };

  const searchedHeroStyle = (heroName) => {
    const hasSearchedData =
      searchHeroes.length &&
      searchHeroes.filter((sh) => !!sh.includes(heroName)).length;

    return hasSearchedData ? "scale3d(1.5, 1.5, 1.5)" : "";
  };

  const handleHeroSelection = (hero) => {
    const heroIndex = heroes.findIndex((h) => h.id === hero.id);
    const newHeroes = [...heroes];
    newHeroes[heroIndex] = { ...hero, isSelected: true };

    if (currentSide === "RADIANT") {
      setRadiantHeroes((selectedHeroes) => [...selectedHeroes, hero]);
      setCurrentSide("DIRE");
    }
    if (currentSide === "DIRE") {
      setDireHeroes((selectedHeroes) => [...selectedHeroes, hero]);
      setCurrentSide("RADIANT");
    }

    setHeroes(newHeroes);
  };

  const triggerRandomHero = () => {
    const random = Math.floor(Math.random() * heroes.length);
    const randomHero = heroes[random];

    if (
      currentSide === "RADIANT" &&
      radiantHeroes.some((rh) => rh.name === randomHero.name)
    ) {
      triggerRandomHero();
    } else if (
      currentSide === "DIRE" &&
      direHeroes.some((rh) => rh.name === randomHero.name)
    ) {
      triggerRandomHero();
    } else {
      handleHeroSelection(randomHero);
      return;
    }
  };

  const renderHeroes = (attribute) => {
    const attributeName =
      attribute === "str"
        ? "Strength"
        : attribute === "agi"
        ? "Agility"
        : "Intelligence";

    return (
      <div className="attribute" key={attributeName}>
        <div className="text-lg hero-attribute">{attributeName}</div>
        <div className="grouped-heroes">
          {heroes.map((hero) => {
            if (hero.primary_attr !== attribute) return <></>;
            return (
              <img
                key={hero.id}
                src={hero.img}
                alt={hero.name}
                height={80}
                width={60}
                onClick={() => !hero.isSelected && handleHeroSelection(hero)}
                style={{
                  transform: searchedHeroStyle(hero.localized_name),
                  outline: hero.isSelected
                    ? "30px solid rgba(255, 0, 0, 0.5)"
                    : "none",
                  outlineOffset: "-30px",
                }}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div onKeyDown={onKeyDown} tabIndex="0" style={{ height: "100vh" }}>
      {!heroes || !heroes.length ? (
        <p>Loading....</p>
      ) : (
        <div className="container max-w-max">
          <div className="text-center">
            <Counter
              currentSide={currentSide}
              triggerRandomHero={triggerRandomHero}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 m-5">
            <div className="col-span-2">
              {renderHeroes("str")}
              {renderHeroes("agi")}
              {renderHeroes("int")}
            </div>
            <div>
              <h1>Hello world</h1>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
