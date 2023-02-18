import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'login',
            meta: {
            layout: 'login-layout'
            },
            component: () =>
                import ('../view/ventas-login.vue'),
        },
        {
            path: '/ventas/admin',
            name: 'ventasAdmin',
            meta: {
                layout: 'dashboard-layout',
                auth:true
            },
            component: () =>
                import ('../view/ventas-admin.vue'),
        },
        {
            path:'/ventas/client/:id',name:'clientDetail',component: () => import ('../view/admin/admin-cliente-detail.vue') 
        },
        
        {
            path: '/pedidos',
            name: 'ventasPedidos',
            meta: {
                layout: 'dashboard-layout',
                auth:true
            },
            component: () =>
                import ('../view/ventas-pedidos.vue'),
        },
        {
            path: '/pedidos/procesar/:orden',
            name: 'ventasProcesar',
            meta: {
                layout: 'dashboard-layout',
                auth:true
            },
            component: () =>
                import ('../view/ventas-pedidos-procesar.vue'),
        },
        {
            path: '/pedidos/newPedido',
            name: 'ventasNewPedido',
            meta: {
                layout: 'dashboard-layout',
                auth:true
            },
            component: () =>
                import ('../view/pedidos/ventas-new-pedido.vue'),
        },
        {
            path:'/procesados',
            name:'ventasProcesadas',
            meta:{
                layout:'dashboard-layout',
                auth:true
            },
            component:()=> import ('../view/ventas-procesadas.vue'),
        },
        {
            path:'/creditos',
            name:'ventasCreditos',
            meta:{
                layout:'dashboard-layout',
                auth:true
            },
            component:()=> import ('../view/ventas-credito.vue'),
        },
        {
            path:'/salidas',
            name:'ventasSalidas',
            meta:{
                layout:'dashboard-layout',
                auth:true
            },
            component:()=> import ('../view/ventas-salidas.vue'),
        },
        {
            path:'/buscar',
            name:'ventasBuscar',
            meta:{
                layout:'dashboard-layout',
                auth:true
            },
            component:()=> import ('../view/ventas-buscar-orden.vue'),
        },
        {
            path:'/cajachica',
            name:'ventasCajaChica',
            meta:{
                layout:'dashboard-layout',
                auth:true
            },
            component:()=> import ('../view/ventas-caja-chica.vue'),
        },
        {
            path:'/corte',
            name:'ventasCorte',
            meta:{
                layout:'dashboard-layout',
                auth:true
            },
            component:()=> import ('../view/ventas-corte.vue'),
        },
        {
            path:'/almacen',
            name:'ventasAlmacen',
            meta:{
                layout:'dashboard-layout',
                auth:true
            },
            component:()=> import ('../view/ventas-almacen.vue'),
        },
        {
            path: '/ofertas',
            name: 'ventasOfertas',
            meta: {
                layout: 'dashboard-layout',
                auth:true
            },
            component: () =>
                import ('../view/ventas-ofertas.vue'),
        },
        {
            path: '/carritoCompras',
            name: 'carritoCompras',
            meta: {
                layout: 'dashboard-layout',
                auth:true
            },
            component: () =>
                import ('../view/ventas-carrito-compras.vue'),
        },



    ]


})

router.beforeEach((to, from, next) => {

    let autenticado = sessionStorage.getItem('autenticado')

    let autorizacion = to.matched.some(record => record.meta.auth)

    if (autorizacion && !autenticado) {
        const loginpath = window.location.pathname;
        next({ name: 'login', query: { from: loginpath } });
    } else {
        next();
    }
});

export default router;