exports.renderPage = async (ctx, next) => {
    await ctx.render('spa');
};