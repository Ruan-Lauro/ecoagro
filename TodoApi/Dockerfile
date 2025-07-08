# Etapa 1: build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

COPY ["TodoApi.csproj", "./"]
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o /app/publish

# ----------------------------------------
# Etapa 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime

WORKDIR /app

COPY --from=build /app/publish .

# Expõe a porta 8080 (padrão do ASP.NET Core no container)
EXPOSE 8080

ENTRYPOINT ["dotnet", "TodoApi.dll"]


