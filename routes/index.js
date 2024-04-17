import userRoutes from './user.js';
import artistRoutes from './artists.js';
import homeRoutes from "./home.js";
import path from "path";


const constructor = (app) => {
    app.use('/', homeRoutes);
    app.use('/user', userRoutes);
    app.use('/artist', artistRoutes);

    app.use('*', (req, res) => {
        res.status(404).json("Error: Page not found");
    });
};

export default constructor;