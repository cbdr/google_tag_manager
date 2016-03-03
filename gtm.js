module.exports = function GoogleTagManagerModule(pb){

  /**
   * GoogleTagManager - A sample for exemplifying what the main module file should
   * look like.
   *
   * @author Ben Tidwell <ben.tidwell@careerbuilder.com>
   */
  function GoogleTagManager(){}

  /**
   * Called when the application is being installed for the first time.
   *
   * @param cb A callback that must be called upon completion.  cb(err, result).
   * The result is ignored
   */
  GoogleTagManager.onInstall = function(cb) {
    cb(null, true);
  };

  /**
   * Called when the application is uninstalling this plugin.  The plugin should
   * make every effort to clean up any plugin-specific DB items or any in function
   * overrides it makes.
   *
   * @param cb A callback that must be called upon completion.  cb(err, result).
   * The result is ignored
   */
  GoogleTagManager.onUninstall = function(cb) {
    cb(null, true);
  };

  /**
   * Called when the application is starting up. The function is also called at
   * the end of a successful install. It is guaranteed that all core PB services
   * will be available including access to the core DB.
   *
   * @param cb A callback that must be called upon completion.  cb(err, result).
   * The result is ignored
   */
  GoogleTagManager.onStartupWithContext = function(context, cb) {
    pb.AnalyticsManager.registerProvider('google_tag_manager', function(req, session, ls, cb){
      var siteId = pb.RequestHandler.sites[req.headers.host] ? pb.RequestHandler.sites[req.headers.host].uid : null;
      var pluginService = new pb.PluginService({site: pb.SiteService.getCurrentSite(siteId)});
      pluginService.getSettingsKV('gtm', function(err, settings) {

        if (pb.util.isError(err)) {
          return cb(err, '');
        }
        else if (!settings || !settings.google_tag_manager_id || settings.google_tag_manager_id.length === 0) {
          pb.log.warn('GoogleTagManager: Settings have not been initialized!');
          return cb(null, '');
        }
        var gtmId          = settings.google_tag_manager_id;
        var script         = '<!-- Google Tag Manager --><noscript><iframe src="//www.googletagmanager.com/ns.html?id='+gtmId +'"height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src="//www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);})(window,document,"script","dataLayer","'+ gtmId +'");</script><!-- End Google Tag Manager -->';
        cb(null, script);

      });
    });

    cb(null, true);
  };

  /**
  * Called when the application is gracefully shutting down.  No guarantees are
  * provided for how much time will be provided the plugin to shut down.
  *
  * @param cb A callback that must be called upon completion.  cb(err, result).
  * The result is ignored
  */
  GoogleTagManager.onShutdown = function(cb) {
    cb(null, true);
  };

  //exports
  return GoogleTagManager;
};