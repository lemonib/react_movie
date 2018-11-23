import React from 'react'

//UI组件
import { Spin, Alert,Pagination } from 'antd';
//
import fetchJSONP from 'fetch-jsonp'
//
import MovieItem from './MovieItem.jsx'


export default class MovieList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
     movies:[], //电影列表
     nowPage:parseInt(props.match.params.page)||1,
     pageSize:12, //每页显示多少条数据
     total:0, //当前电影分类下，总个数
     isloading:true, //是否正在加载数据 
     movieType:props.match.params.type,
    }
  }

  componentWillMount(){
    // setTimeout(()=>{
    //   this.setState({
    //     isloading:false
    //   })
    // },1000)
    this.loadMovieListByTypeAndPage()
  }

  componentWillReceiveProps(nextProps){
    //每当地址栏目变化的时候
    this.setState({
      isloading:true,
      nowPage:parseInt(nextProps.match.params.page)||1,
      movieType:nextProps.match.params.type,
    },function(){
      this.loadMovieListByTypeAndPage()
    })
  }
 
  render() {
    return <div>
    {this.renderList()}
    </div>
  }

  //获取数据
  loadMovieListByTypeAndPage = ()=>{

    const start = this.state.pageSize * (this.state.nowPage - 1)
    const url = `https://api.douban.com/v2/movie/${this.state.movieType}?start=${start}&count=${this.state.pageSize}`


    fetchJSONP(url).then(response=>{
      return response.json()
    }).then(data=>{
      this.setState({
        isloading:false,
        movies:data.subjects,
        total:data.total

      })
    })

  //   const data = require('../test_data/'+this.state.movieType+'.json')
  //   setTimeout(()=>{
  //     this.setState({
  //       isloading:false,
  //       movies:data.subjects,
  //       total:data.total
  //     })
  //   },1000)
  }



  renderList = ()=>{
    if(this.state.isloading){
      return <Spin tip="Loading...">
      <Alert
      message="加载中"
      description="请稍侯"
      type="info"
      />
    </Spin>
    }else{
      return <div>
      <div style={{display:'flex',flexWrap:'wrap'}}>
      {this.state.movies.map(item=>{
        return <MovieItem {...item} history={this.props.history} key={item.id}></MovieItem>
      })}
      </div>

      <Pagination defaultCurrent={this.state.nowPage} total={this.state.total} pageSize={this.state.pageSize} 
      onChange={this.pageChanged}/>
      </div>
    }
  }


  //页面改变时候
  pageChanged = (page)=>{
    // window.location.href = '/#/movie/'+this.state.movieType+'/'+page
    this.props.history.push('/movie/'+this.state.movieType+'/'+page)
  }
}

