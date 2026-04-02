// Owner Posts Configuration
// The site owner can edit this file to add new posts and pictures to the homepage.
$(document).ready(function () {
    // Edit the array below to add, remove, or change posts.
    // Ensure the image path is correct, e.g., 'images/your-image-name.jpg'
    const ownerPosts = [
        {
            image: "images/promo1.png",
            title: "Welcome to Ethio Homes",
            description: "We are thrilled to present some of the best real estate properties here. Keep an eye out for fresh updates from the owner."
        },
        {
            image: "images/promo2.png",
            title: "New Projects Commencing",
            description: "We have just partnered with top real estate companies to bring you exciting projects in Bole and CMC areas."
        }
    ];

    const postsContainer = $('#posts-container');
    if (postsContainer.length) {
        ownerPosts.forEach(post => {
            const postHtml = `
                <div class="col-md-6 mb-4">
                    <div class="owner-post-card">
                        <img src="${post.image}" alt="${post.title}" class="img-fluid post-image" />
                        <div class="post-content">
                            <h4>${post.title}</h4>
                            <p>${post.description}</p>
                        </div>
                    </div>
                </div>
            `;
            postsContainer.append(postHtml);
        });
    }
});
