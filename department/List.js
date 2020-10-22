import schema from './schema';
import service from './service';
import '@ant-design/compatible/assets/index.css';
import clone from 'clone';
import frSchemaUtils from '@/outter/fr-schema-antd-utils/src';

const { ListPage } = frSchemaUtils.components;

export class List extends ListPage {
    constructor(props) {
        super(props, {
            schema: clone(schema),
            authorityKey: 'department',
            queryArgs: {
                pageSize: 9999,
                order: 'order_no.asc',
            },
            infoProps: {
                offline: true,
            },
            service,
        });
    }

    dataConvert(data) {
        let list = data.list;
        // 遍历数据并标记父子关系
        for (let i = 0; i < list.length; i++) {
            list[i].tier = list[i].key.split('_').length;
            list[i].tierKey = list[i].key.includes('_')
                ? list[i].key.slice(0, list[i].key.lastIndexOf('_'))
                : '_';
        }
        // 数据根据层级排序(倒序)
        list.sort(this.sortData);
        let results = [];
        // 数据转换成table所需
        for (let i = 0; i < list.length; i++) {
            // 顶级不需要处理
            // if (list[i].tier === 1) {
            //     continue
            // }
            // 查找当前项的父级
            let item = list.find((value) => {
                return value.key === list[i].tierKey;
            });
            // 找不到父节点则将当前节点作为顶级节点
            if (!item) {
                list[i].tier = 1;
                list[i].tierKey = list[i].key;
                results.push(list[i]);
                continue;
            }
            if (!item.children) {
                item.children = [];
            }
            item.children.push(list[i]);
            results.push(item);
        }
        // 合并去重
        results = Array.from(new Set(results));
        let res = [];
        // 只保留顶级
        results.map((item) => item.tier === 1 && res.push(item));
        data.list = res;
        data.pagination = { ...data.pagination, total: res.length };
        return data;
    }

    sortData(a, b) {
        return b.tier - a.tier;
    }
}

export default List;
