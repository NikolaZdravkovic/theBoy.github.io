var config = {
    /**
     * En devMode, le tracking est désactivé et
     * un alert s'affiche afin d'éviter d'envoyer
     * le format dans cet état. 
     */
    devMode: false,

    /**
     * Mobile   : 1080 x 1920
     * Tablette : 1536 x 2048
     */
    size: {
        width: 1080,
        height: 1920
    },

    /**
     * Activation du ratio paysage.
     * Si false, on peut supprimer les 
     * deux images landscape du dossier assets
     */
    landscapeRatioEnabled: false,
    
    /**
     * L'interstitiel conserve un ratio fixe 
     * (9/16 pour le mobile, 3/4 pour les tablettes).
     * Il faut donc définir la couleur du fond
     * lorsque l'écran ne respecte pas ce ratio.
     */
    backgroundColor: "#000000",

    /**
     * Permet de définir si l'on met en place 
     * un CTA personnalisé d'incitation au scratch.
     * Url vers l'image (relative ou absolue) ou false.
     * ex: 'assets/screen-1_cta.png'
     */
    customScratchCTA: 'assets/screen-1_cta.png',

    /**
     * gaID        : Fourni par le traffic.
     * campaign_id : Nom de la campagne. Correspond à la "dimension1".
     * app         : Placement. Correspond à la "dimension2".
     */
    tracking: {
        gaID: 'UA-92068038-21',
        gaEventCategory: "Scratch",
        campaign_id: "The Boy 2",
        app: "mobile"
    }
};

if (config.devMode) {
    alert('devMode');
    config.tracking.gaID = null;
}