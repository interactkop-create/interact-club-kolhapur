import React from 'react';
import { Award, Target, Eye, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About <span className="text-primary">Interact Club of Kolhapur</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              We are a dynamic youth service organization sponsored by Rotary International, committed to developing leadership skills and serving our community.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Interact Club of Kolhapur is part of the worldwide Interact network, bringing together young people aged 12-18 who are passionate about creating positive change in their communities.
                </p>
                <p>
                  Founded with the vision of empowering youth through service and leadership, we have grown into a vibrant community of dedicated individuals working together to make a meaningful impact.
                </p>
                <p>
                  Our club provides opportunities for young leaders to develop essential life skills, build international friendships, and have fun while making a difference in the world around us.
                </p>
                <p>
                  Through diverse projects ranging from environmental conservation to education initiatives, we strive to address community needs while fostering personal growth and global citizenship among our members.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80"
                alt="Interact Club Activities"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To provide young people with opportunities to develop leadership skills, practice responsible citizenship, and promote international understanding through service projects.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To create a world where young leaders unite across cultures, inspire change through service, and build communities of peace, understanding, and compassion.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Service Above Self</li>
                  <li>• Leadership Development</li>
                  <li>• Global Citizenship</li>
                  <li>• Ethical Responsibility</li>
                  <li>• Cultural Understanding</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What We Do
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our diverse range of service projects and activities focus on creating positive impact
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center card-hover">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">Community Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Organizing community clean-ups, food drives, and support programs for those in need.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center card-hover">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">Education</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Supporting education through tutoring programs, book donations, and scholarship initiatives.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center card-hover">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">Environment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Tree plantation drives, waste management campaigns, and environmental awareness programs.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center card-hover">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">Health & Wellness</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Blood donation camps, health awareness campaigns, and fitness initiatives.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partnership with Rotary */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
                  Our Partnership with Rotary
                </h2>
                <p className="text-muted-foreground mb-4">
                  Interact clubs are sponsored by individual Rotary clubs, which provide support, guidance, and mentorship. This partnership allows Interact members to expand their community connections and form lasting relationships with Rotarians who share their passion for service.
                </p>
                <p className="text-muted-foreground">
                  Through this collaboration, we benefit from the experience and resources of Rotary International while bringing fresh perspectives and youthful energy to service projects in Kolhapur and beyond.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};