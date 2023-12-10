const filterProxyName = (proxy: any) => {
    let proxyName = `${proxy.type} ${proxy.id}`;

    switch (proxy.type) {
        case 'subscription':
            proxyName = proxy.info.email;
            break;

        case 'application':
            proxyName = proxy.id;
            break;
        case 'volume':
            proxyName = proxy.id;
            break;
        case 'storage':
            proxyName = `${proxy.info.owner} ${proxy.id}`;
            break;
        default:
            break;
    }

    return proxyName;
};
