import React, { useEffect, useState } from 'react'
import axios from 'axios';

const BoardPage = () => {
    const [boardList, setList] = useState([{
        id: '',
        title: '',
        content: '',
        createdOn: ''
    }]);

    useEffect(() => {
        axios.get("/boards").then(res => setList(res.data))
        .catch(error => console.log(error))
    })

    return (<div className='container'>
        <div className='boardList'>
            <table className='boardTable'>
                <thead>
                    <tr>
                        <th>
                            번호
                        </th>
                        <th>
                            제목
                        </th>
                        <th>
                            작성일자
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {dummyData.map((board) => {
                        return (
                            <tr key={board.id}>
                                <td>{board.id}</td>
                                <td>{board.title}</td>
                                <td>{board.createdOn}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    </div>)
}

export default BoardPage

const dummyData = [
    {
      id: 3,
      title: '테스트 게시글입니다. 내용없습니다.',
      content: '쭈헤이',
      createdOn: '2020-10-04',
    },
    {
      id: 2,
      title: '게시판 테스트입니다.',
      content: 'admin',
      createdOn: '2020-10-03',
    },
    {
      id: 1,
      title: '공지사항입니다. 필독 부탁드립니다!',
      content: 'admin',
      createdOn: '2020-10-01',
    },
  ]