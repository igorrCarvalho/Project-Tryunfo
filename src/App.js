import React from 'react';
import Form from './components/Form';
import Card from './components/Card';
import NameSearch from './components/NameSearch';
import RarityFltr from './components/RarityFltr';
import TrunfoFilter from './components/TrunfoFilter';

const stateAtributes = {
  name: '',
  description: '',
  attr1: '0',
  attr2: '0',
  attr3: '0',
  image: '',
  select: '',
  check: false,
  btnDisable: true,
  allCards: [],
  hasTrunfo: false,
  nameSearch: '',
  rarityFilter: 'todas',
  trunfoFilter: false,
};

class App extends React.Component {
  constructor() {
    super();
    this.state = stateAtributes;
    this.filterItems = this.filterItems.bind(this);
    this.btnClick = this.btnClick.bind(this);
    this.handleState = this.handleState.bind(this);
    this.checkInputs = this.checkInputs.bind(this);
    this.checkAttr = this.checkAttr.bind(this);
    this.returnBtnDisable = this.returnBtnDisable.bind(this);
    this.btnDiscart = this.btnDiscart.bind(this);
    this.allFilters = this.allFilters.bind(this);
  }

  handleState({ target }) {
    const valor = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    this.setState({
      [name]: valor,
    }, () => this.returnBtnDisable());
  }

  btnClick(e) {
    const {
      name, description, attr1, attr2, attr3, image, check, select, allCards,
    } = this.state;
    e.preventDefault();
    if (check === true) this.setState({ hasTrunfo: true });
    const newItem = {
      nome: name,
      desc: description,
      attr1,
      attr2,
      attr3,
      img: image,
      trunfo: check,
      rarity: select,
    };
    const newState = [...allCards, newItem];
    this.setState({ allCards: newState });
    this.setState({
      name: '',
      description: '',
      image: '',
      attr1: '0',
      attr2: '0',
      attr3: '0',
      select: '',
      check: false,
      btnDisable: true,
    });
  }

  filterItems({ target }) {
    const { value } = target;
    this.setState({ nameSearch: value });
  }

  checkInputs() {
    const { name, description, image, select } = this.state;
    return (!name || !description || !image || !select);
  }

  checkAttr() {
    const { attr1, attr2, attr3 } = this.state;
    const numberAttr1 = Number(attr1);
    const numberAttr2 = Number(attr2);
    const numberAttr3 = Number(attr3);
    const attrSum = numberAttr1 + numberAttr2 + numberAttr3;
    const maxValue = 210;
    const maxAttrValue = 90;
    if (attrSum > maxValue) return true;
    return (
      numberAttr1 > maxAttrValue
      || numberAttr2 > maxAttrValue
      || numberAttr3 > maxAttrValue
      || numberAttr1 < 0 || numberAttr2 < 0 || numberAttr3 < 0
    );
  }

  returnBtnDisable() {
    const verifyInput = this.checkInputs();
    const verifyAttr = this.checkAttr();
    if (verifyInput === true || verifyAttr === true) {
      return this.setState({
        btnDisable: true,
      });
    }
    this.setState({
      btnDisable: false,
    });
  }

  btnDiscart(index) {
    const { allCards } = this.state;
    const filteredArr = allCards.filter((_obj, ind) => ind !== index);
    if (allCards[index].trunfo === true) {
      return this.setState({ allCards: filteredArr, hasTrunfo: false });
    }
    this.setState({ allCards: filteredArr });
  }

  allFilters() {
    const { trunfoFilter, rarityFilter, nameSearch, allCards } = this.state;
    if (trunfoFilter) return allCards.filter((obj) => obj.trunfo);
    if (nameSearch) {
      return allCards.filter((card) => card.nome.toLowerCase()
        .includes(nameSearch.toLowerCase()));
    }
    if (rarityFilter === 'todas') {
      return allCards;
    }
    if (rarityFilter) {
      return allCards.filter((obj) => obj.rarity === rarityFilter);
    }
  }

  render() {
    const {
      name,
      description,
      attr1,
      attr2,
      attr3,
      image,
      check,
      select,
      btnDisable,
      allCards,
      hasTrunfo,
      nameSearch,
      rarityFilter,
      trunfoFilter,
    } = this.state;
    const filterChoosed = this.allFilters();
    return (
      <>
        <div>
          <h1 className="gameTitle">Tryunfo</h1>
        </div>
        <div className="formDiv">
          <Form
            cardName={ name }
            cardDescription={ description }
            cardAttr1={ attr1 }
            cardAttr2={ attr2 }
            cardAttr3={ attr3 }
            cardImage={ image }
            cardRare={ select }
            cardTrunfo={ check }
            isSaveButtonDisabled={ btnDisable }
            onInputChange={ this.handleState }
            onSaveButtonClick={ this.btnClick }
            allCards={ allCards }
            hasTrunfo={ hasTrunfo }
          />
          <div className="cardWhite">
            <div className="cardPreview">
              <Card
                cardName={ name }
                cardDescription={ description }
                cardAttr1={ attr1 }
                cardAttr2={ attr2 }
                cardAttr3={ attr3 }
                cardImage={ image }
                cardRare={ select }
                cardTrunfo={ check }
              />
            </div>
          </div>
        </div>
        <div>
          <h3 className="allCardsTitle">Todas as cartas</h3>
          <div className="filtersDiv">
            <h3>Filtros de busca</h3>
            <NameSearch
              disable={ trunfoFilter }
              text={ nameSearch }
              filterFunc={ this.filterItems }
            />
            <RarityFltr
              disable={ trunfoFilter }
              rare={ rarityFilter }
              handleState={ this.handleState }
            />
            <TrunfoFilter isChecked={ trunfoFilter } handleState={ this.handleState } />
          </div>
          <div className="cardsDiv">
            { filterChoosed.map((obj, index) => (
              <div className="cardWhite" key={ index }>
                <div className="cardPreview">
                  <Card
                    cardName={ obj.nome }
                    cardDescription={ obj.desc }
                    cardAttr1={ obj.attr1 }
                    cardAttr2={ obj.attr2 }
                    cardAttr3={ obj.attr3 }
                    cardImage={ obj.img }
                    cardRare={ obj.rarity }
                    cardTrunfo={ obj.trunfo }
                  />
                  <button
                    className="deleteCard"
                    data-testid="delete-button"
                    type="button"
                    onClick={ () => this.btnDiscart(index) }
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
}

export default App;
