name := "Wish"

version := "1.0-SNAPSHOT"

libraryDependencies ++= Seq(
  "mysql" % "mysql-connector-java" % "5.1.18",
  javaJdbc,
  javaEbean,
  cache
)     

play.Project.playJavaSettings
