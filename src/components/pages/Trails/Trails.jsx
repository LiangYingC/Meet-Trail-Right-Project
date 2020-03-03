import React, { Component, Fragment } from 'react';
import Header from '../../shared/Header';
import Footer from '../../shared/Footer';
import TrailsFilterSort from './TrailsFilterSort';
import TrailsListArea from './TrailsListArea';
import { DB } from '../../../lib';


const trailsFilterData = [
    {
        id: 0,
        title: '所在區域',
        questionIcon: false,
        tag: 'area',
        list: ['全部', '北部', '中部', '南部', '東部', '外島']
    },
    {
        id: 1,
        title: '步道難度',
        questionIcon: true,
        tag: 'difficulty',
        list: ['全部', '輕鬆', '有點挑戰', '很有挑戰']
    },
    {
        id: 2,
        title: '所需時間',
        questionIcon: false,
        tag: 'time',
        list: ['全部', '1 小時以下', '1 - 3 小時', '3 - 5 小時', '5 小時以上']
    },
    {
        id: 3,
        title: '步道全長',
        questionIcon: false,
        tag: 'length',
        list: ['全部', '2 公里以下', '2 - 4 公里', '4 - 8 公里', '8 公里以上']
    }
]

class Trails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            trailsAll: null,
            trailsVisible: null,
            trailsFilterCheckedList: [
                {
                    tag: 'area',
                    value: 0,
                    trailsFilterList: trailsFilterData[0].list
                },
                {
                    tag: 'difficulty',
                    value: 0,
                    trailsFilterList: trailsFilterData[1].list
                },
                {
                    tag: 'time',
                    value: 0,
                    trailsFilterList: trailsFilterData[2].list
                },
                {
                    tag: 'length',
                    value: 0,
                    trailsFilterList: trailsFilterData[3].list
                }
            ],
            trailsSortChecked: '0'
        }
    }

    componentDidMount() {
        const { history } = this.props
        this.getTrailsList(history)
    }

    getTrailsList = (history) => {
        const { trailsSortChecked } = this.state

        let sortKey
        let sortRank
        switch (trailsSortChecked) {
            case '0':
                sortKey = 'view_count'
                sortRank = 'desc'
                break;

            case '1':
                sortKey = 'time'
                sortRank = 'asc'
                break;

            case '2':
                sortKey = 'difficulty'
                sortRank = 'desc'
                break;

            case '3':
                sortKey = 'like_data.count'
                sortRank = 'desc'
                break;

            default:
                break;
        }

        this.setState(preState => ({
            ...preState,
            trailsAll: null,
            trailsVisible: null
        }))

        history.location.search ?
            DB.ref('trails')
                .orderBy(sortKey, sortRank)
                .get()
                .then(querySnapshot => {
                    const equalPosition = history.location.search.indexOf('=')
                    const searchValue = decodeURI(history.location.search.slice(equalPosition + 1))
                    let trailsData = []
                    querySnapshot.forEach(doc => {
                        if (doc.data().title.indexOf(`${searchValue}`) >= 0) {
                            trailsData.push(doc.data())
                        }
                        this.setState({
                            trailsAll: trailsData,
                            trailsVisible: trailsData
                        }, () => this.setVisibleList())
                    })
                })
            :
            DB.ref('trails')
                .orderBy(sortKey, sortRank)
                .get()
                .then(querySnapshot => {
                    let trailsData = []
                    querySnapshot.forEach(doc => {
                        trailsData.push(doc.data())
                        this.setState({
                            trailsAll: trailsData,
                            trailsVisible: trailsData
                        }, () => this.setVisibleList())
                    })
                })
    }

    changeSort = (e) => {
        const { history } = this.props
        e.persist()
        this.setState(preState => ({
            ...preState,
            trailsSortChecked: e.target.value
        }), () => this.getTrailsList(history))
    }


    changeFilter = (e) => {
        e.persist() // React 中，event 換到別的 thread 時，event 屬性資料會清除，用 event.persist() 使導致清空的 synthetic event 脫離 pool。
        this.setState(preState => ({
            trailsFilterCheckedList: preState.trailsFilterCheckedList.map((filter, index) => {
                if (filter.tag === e.target.name) {
                    return {
                        tag: e.target.name,
                        value: Number(e.target.value),
                        trailsFilterList: trailsFilterData[index].list
                    }
                } return filter
            })
        }))
        this.setVisibleList()
    }

    setVisibleList = () => {
        this.setState(preState => ({
            trailsVisible: preState.trailsAll.filter(trail => {
                const areaFilter = preState.trailsFilterCheckedList[0]
                const difficultyFilter = preState.trailsFilterCheckedList[1]
                const timeFilter = preState.trailsFilterCheckedList[2]
                const lengthFilter = preState.trailsFilterCheckedList[3]

                let timeValue
                let lengthValue
                switch (timeFilter.trailsFilterList[timeFilter.value]) {
                    case '1 小時以下':
                        timeValue = {
                            min: 0,
                            max: 60
                        }

                        break;
                    case '1 - 3 小時':
                        timeValue = {
                            min: 60,
                            max: 180
                        }

                        break;
                    case '3 - 5 小時':
                        timeValue = {
                            min: 180,
                            max: 300
                        }

                        break;
                    case '5 小時以上':
                        timeValue = {
                            min: 300,
                            max: 100000
                        }
                        break;

                    default:
                        timeValue = {
                            min: null,
                            max: null
                        }
                        break;
                }


                switch (lengthFilter.trailsFilterList[lengthFilter.value]) {
                    case '2 公里以下':
                        lengthValue = {
                            min: 0,
                            max: 2
                        }

                        break;
                    case '2 - 4 公里':
                        lengthValue = {
                            min: 2,
                            max: 4
                        }

                        break;
                    case '4 - 8 公里':
                        lengthValue = {
                            min: 4,
                            max: 8
                        }

                        break;
                    case '8 公里以上':
                        lengthValue = {
                            min: 8,
                            max: 10000
                        }
                        break;

                    default:
                        lengthValue = {
                            min: null,
                            max: null
                        }
                        break;
                }

                if ((trail.location.area === areaFilter.trailsFilterList[areaFilter.value] || areaFilter.value === 0) &&
                    (trail.difficulty[0] === difficultyFilter.trailsFilterList[difficultyFilter.value] || difficultyFilter.value === 0) &&
                    ((timeValue.min <= trail.time && trail.time < timeValue.max) || timeFilter.value === 0) &&
                    ((lengthValue.min <= trail.length && trail.length < lengthValue.max) || lengthFilter.value === 0)
                ) {
                    return trail
                }
            })
        }))
    }

    render() {
        const {
            trailsVisible,
            trailsFilterCheckedList,
            trailsSortChecked
        } = this.state
        const { history } = this.props

        return (
            <Fragment>
                <Header history={history} />
                <TrailsFilterSort
                    trailsFilterProps={trailsFilterCheckedList}
                    changeFilter={this.changeFilter}
                    trailsSortChecked={trailsSortChecked}
                    changeSort={this.changeSort}
                />
                <TrailsListArea trailsVisible={trailsVisible} />
                <Footer />
            </Fragment>
        )
    }
}

export default Trails;