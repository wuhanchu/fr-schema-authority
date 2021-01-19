import '@ant-design/compatible/assets/index.css';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { PureComponent } from 'react';
import DataList from '@/pages/authority/department/DataList';

export class List extends PureComponent {
    render() {
        return (
            <PageHeaderWrapper>
                <DataList/>
            </PageHeaderWrapper>
        );
    }
}

export default List;
