import React from 'react';
import { Link } from "react-router-dom";

export default ({tags})=>(
    <div>
        {tags.map(tag=><code key={tag}><Link to={`/searchtag/${tag}`}>{tag} </Link></code>)}
    </div>
)