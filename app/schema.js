import {GraphQLBoolean, GraphQLFloat, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull} from "graphql";

const graphql = require('graphql');
import business from "./business/business.container";
import mongoose from "mongoose";


const {
    GraphQLObjectType, GraphQLString,
    GraphQLID, GraphQLSchema
} = graphql;


const OrderedProductsType = new GraphQLObjectType({
    name: 'OrderedProductsType',
    fields: () => ({
        amount: {type: GraphQLInt},
        hint: {type: GraphQLString},
        name: {type: GraphQLString},
        productId: {type: GraphQLInt},
    })
})

const PageInfo = new GraphQLObjectType({
    name: 'PageInfoType',
    fields: () => ({
        startCursor: {type: GraphQLString},
        endCursor: {type: GraphQLString},
        hasNextPage: {type: GraphQLBoolean}
    })
})

const Edge = (itemType) => {
    return new GraphQLObjectType({
        name: 'EdgeType',
        fields: () => ({
            node: {type: itemType},
            cursor: {type: GraphQLString}
        })
    })
}

const Page = (itemType) => {
    return new GraphQLObjectType({
        name: 'PageType',
        fields: () => ({
            totalCount: {type: GraphQLInt},
            edges: {type: new GraphQLList(Edge(itemType))},
            pageInfo: {type: PageInfo}
        })
    })
}

const PageOrder = (itemType) => {
    return new GraphQLObjectType({
        name: 'PageOrderType',
        fields: () => ({
            totalCount: {type: GraphQLInt},
            edges: {type: new GraphQLList(EdgeOrder(itemType))},
            pageInfo: {type: PageInfo}
        })
    })
}

const EdgeOrder = (itemType) => {
    return new GraphQLObjectType({
        name: 'EdgeOrderType',
        fields: () => ({
            node: {type: itemType},
            cursor: {type: GraphQLString}
        })
    })
}
const OrderedProductsInputType = new GraphQLInputObjectType({
    name: 'OrderedProductsInputType',
    fields: () => ({
        amount: {type: GraphQLInt},
        hint: {type: GraphQLString},
        name: {type: GraphQLString},
        productId: {type: GraphQLInt},
    })
})


const TableLabelsType = new GraphQLObjectType({
    name: 'TableLabelsType',
    fields: () => ({
        wartoscOdzywcza: {type: GraphQLString},
        wartoscEnergetyczna: {type: GraphQLString},
        tluszcz: {type: GraphQLString},
        wTymKwasyNasycone: {type: GraphQLString},
        weglowodany: {type: GraphQLString},
        wTymCukry: {type: GraphQLString},
        bialko: {type: GraphQLString},
        sol: {type: GraphQLString},
        witaminaC: {type: GraphQLString},
        kationy: {type: GraphQLString},
        wapniowy: {type: GraphQLString},
        magnezowy: {type: GraphQLString},
        sodowy: {type: GraphQLString},
        potasowy: {type: GraphQLString},
        aniony: {type: GraphQLString},
        wodoroweglanowy: {type: GraphQLString},
        siarczanowy: {type: GraphQLString},
        chlorkowy: {type: GraphQLString},
        fluorkowy: {type: GraphQLString},
        suma: {type: GraphQLString},
    })
})

const TableValuesType = new GraphQLObjectType({
    name: 'TableValuesType',
    fields: () => ({
        wartoscOdzywcza: {type: GraphQLString},
        wartoscEnergetyczna: {type: GraphQLString},
        tluszcz: {type: GraphQLString},
        wTymKwasyNasycone: {type: GraphQLString},
        weglowodany: {type: GraphQLString},
        wTymCukry: {type: GraphQLString},
        bialko: {type: GraphQLString},
        sol: {type: GraphQLString},
        witaminaC: {type: GraphQLString},
        kationy: {type: GraphQLString},
        wapniowy: {type: GraphQLString},
        magnezowy: {type: GraphQLString},
        sodowy: {type: GraphQLString},
        potasowy: {type: GraphQLString},
        aniony: {type: GraphQLString},
        wodoroweglanowy: {type: GraphQLString},
        siarczanowy: {type: GraphQLString},
        chlorkowy: {type: GraphQLString},
        fluorkowy: {type: GraphQLString},
        suma: {type: GraphQLString},
    })
})


const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: () => ({
        id: {type: GraphQLID},
        bottle: {type: GraphQLString},
        name: {type: GraphQLString},
        tableLabels: {type: TableLabelsType},
        tableValues: {type: TableValuesType},
        category: {type: GraphQLString},
        price: {type: GraphQLFloat},
        netPrice: {type: GraphQLFloat},
        vat: {type: GraphQLFloat},
        hint: {type: GraphQLString},
        number: {type: GraphQLInt}
    })
});

const OrderType = new GraphQLObjectType({
    name: 'Order',
    fields: () => ({
        orderedProducts: {type: new GraphQLList(OrderedProductsType)},
        placementDate: {type: GraphQLString},
        dateInMs: {type: GraphQLString},
        totalPrice: {type: GraphQLString},
        email: {type: GraphQLString},
        name: {type: GraphQLString},
        phone: {type: GraphQLString},
        zip: {type: GraphQLString},
        address: {type: GraphQLString},
        status: {type: GraphQLString},
        customerId: {type: GraphQLString},
        notes: {type: GraphQLString},
        id: {type: GraphQLID}
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLID},
        email: {type: GraphQLString},
        name: {type: GraphQLString},
        surname: {type: GraphQLString},
        role: {type: GraphQLString},
        registerDateInMs: {type: GraphQLString},
    })
});

const RegisterType = new GraphQLObjectType({
    name: 'Register',
    fields: () => ({
        email: {type: GraphQLString},
        name: {type: GraphQLString},
        surname: {type: GraphQLString},
        password: {type: GraphQLString},
        role: {type: GraphQLString},
        registerDateInMs: {type: GraphQLString},
        // verified: {type: GraphQLBoolean},
    })
});

const LoginType = new GraphQLObjectType({
    name: 'Login',
    fields: () => ({
        email: {type: GraphQLString},
        password: {type: GraphQLString},
        token: {type: GraphQLString},
    })
});

const LogoutType = new GraphQLObjectType({
    name: 'Logout',
    fields: () => ({
            userId: {type: GraphQLString},
        }
    )
});

const convertNodeToCursor = (node) => {
    return new Buffer(node.id, 'binary').toString('base64')
}

const convertCursorToNodeId = (cursor) => {
    return new Buffer(cursor, 'base64').toString('binary')
}

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        product: {
            type: new GraphQLList(ProductType),
            args: {category: {type: GraphQLString}},
            async resolve(parent, args) {
                if (args.category) {
                    return await business.getProductManager().getProductsByCategory(args.category);
                }
                return await business.getProductManager().get();
            }
        },
        order: {
            type: new GraphQLList(OrderType),
            args: {email: {type: GraphQLString}},
            async resolve(parent, args) {
                if (args.email) {
                    return await business.getOrderManager().getOrderByUserEmail(args.email);
                }
                return await business.getOrderManager().get();
            }
        },
        allOrders: {
            type: PageOrder(OrderType),
            args: {
                first: {type: GraphQLInt},
                afterCursor: {type: GraphQLString},
            },
            // type: new GraphQLList(OrderType),
            // args: {email: {type: GraphQLString}},
            async resolve(parent, args) {
                let {first, afterCursor} = args
                let afterIndex = 0
                // if (!args.email) {
                return await business.getOrderManager().getAllOrders().then(res => {
                    let data = res
                    if (typeof afterCursor === 'string') {
                        /* Extracting nodeId from afterCursor */
                        let nodeId = convertCursorToNodeId(afterCursor)
                        /* Finding the index of nodeId */
                        let nodeIndex = data.findIndex(datum => datum.id === nodeId)
                        if (nodeIndex >= 0) {
                            afterIndex = nodeIndex + 1 // 1 is added to exclude the afterIndex node and include items after it
                        }
                    }

                    const slicedData = data.slice(afterIndex, afterIndex + first)
                    const edges = slicedData.map(node => ({
                        node,
                        cursor: convertNodeToCursor(node)
                    }))

                    let startCursor, endCursor = null
                    if (edges.length > 0) {
                        startCursor = convertNodeToCursor(edges[0].node)
                        endCursor = convertNodeToCursor(edges[edges.length - 1].node)
                    }
                    let hasNextPage = data.length > afterIndex + first

                    return {
                        totalCount: data.length,
                        edges,
                        pageInfo: {
                            startCursor,
                            endCursor,
                            hasNextPage
                        }
                    }
                });
                // }
                // return await business.getOrderManager().get();
            }
        },
        allUsers: {
            type: Page(UserType),
            args: {
                first: {type: GraphQLInt},
                afterCursor: {type: GraphQLString},
            },
            async resolve(parent, args) {
                // if (!args.email) {
                let {first, afterCursor} = args
                let afterIndex = 0
                return await business.getUserManager().getAllUsers().then(res => {
                    let data = res
                    if (typeof afterCursor === 'string') {
                        /* Extracting nodeId from afterCursor */
                        let nodeId = convertCursorToNodeId(afterCursor)
                        /* Finding the index of nodeId */
                        let nodeIndex = data.findIndex(datum => datum.id === nodeId)
                        if (nodeIndex >= 0) {
                            afterIndex = nodeIndex + 1 // 1 is added to exclude the afterIndex node and include items after it
                        }
                    }

                    const slicedData = data.slice(afterIndex, afterIndex + first)
                    const edges = slicedData.map(node => ({
                        node,
                        cursor: convertNodeToCursor(node)
                    }))

                    let startCursor, endCursor = null
                    if (edges.length > 0) {
                        startCursor = convertNodeToCursor(edges[0].node)
                        endCursor = convertNodeToCursor(edges[edges.length - 1].node)
                    }
                    let hasNextPage = data.length > afterIndex + first

                    return {
                        totalCount: data.length,
                        edges,
                        pageInfo: {
                            startCursor,
                            endCursor,
                            hasNextPage
                        }
                    }
                });
                // }
                // return await business.getOrderManager().get();
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        makeOrder: {
            type: OrderType,
            args: {
                orderedProducts: {type: new GraphQLList(OrderedProductsInputType)},
                placementDate: {type: new GraphQLNonNull(GraphQLString)},
                dateInMs: {type: new GraphQLNonNull(GraphQLString)},
                totalPrice: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                phone: {type: new GraphQLNonNull(GraphQLString)},
                zip: {type: new GraphQLNonNull(GraphQLString)},
                address: {type: new GraphQLNonNull(GraphQLString)},
                status: {type: new GraphQLNonNull(GraphQLString)},
                customerId: {type: new GraphQLNonNull(GraphQLString)},
                notes: {type: new GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent, args) {
                return await business.getOrderManager().makeOrder(args);
            }
        },
        deleteOrder: {
            type: OrderType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent, args) {
                return await business.getOrderManager().deleteOrderById(args.id);
            }
        },
        updateStatus: {
            type: OrderType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                status: {type: new GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent, args) {
                return await business.getOrderManager().updateStatusById(args.id, args.status);
            }
        },
        updateNotes: {
            type: OrderType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                notes: {type: new GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent, args) {
                return await business.getOrderManager().updateNotesById(args.id, args.notes);
            }
        },
        updateRole: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                role: {type: new GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent, args) {
                return await business.getUserManager().updateRoleById(args.id, args.role);
            }
        },
        registerUser: {
            type: RegisterType,
            args: {
                email: {type: new GraphQLNonNull(GraphQLString)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                surname: {type: new GraphQLNonNull(GraphQLString)},
                role: {type: new GraphQLNonNull(GraphQLString)},
                password: {type: new GraphQLNonNull(GraphQLString)},
                registerDateInMs: {type: new GraphQLNonNull(GraphQLString)},
                // verified: {type: new GraphQLNonNull(GraphQLBoolean)}
            },
            async resolve(parent, args) {
                return await business.getUserManager(args).createNewOrUpdate(args);
            }
        },
        loginUser: {
            type: LoginType,
            args: {
                email: {type: new GraphQLNonNull(GraphQLString)},
                password: {type: new GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent, args) {
                return await business.getUserManager(args).authenticate(args.email, args.password);
            }
        },
        logoutUser: {
            type: LogoutType,
            args: {
                userId: {type: new GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent, args) {
                return await business.getUserManager(args).removeHashSession(args.userId);
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
